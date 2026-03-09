import { defineNitroPlugin } from '#imports'
import process from 'node:process'

export default defineNitroPlugin((nitro) => {
  const activeRequests = new Map<number, { start: number; url: string }>()
  let reqId = 0

  const getMem = () => {
    const m = process.memoryUsage()
    return {
      rss: Math.round(m.rss / 1e6),
      heapUsed: Math.round(m.heapUsed / 1e6),
      heapTotal: Math.round(m.heapTotal / 1e6),
      external: Math.round(m.external / 1e6),
    }
  }

  // ---- Log memory + active requests every 10s ----
  setInterval(() => {
    const mem = getMem()
    console.log(
      `[MemoryGuardian:server] rss=${mem.rss}MB heap=${mem.heapUsed}/${mem.heapTotal}MB external=${mem.external}MB activeRequests=${activeRequests.size}`
    )

    if (activeRequests.size > 50) {
      console.warn(`[MemoryGuardian] High active requests: ${activeRequests.size}`)
      console.table(Array.from(activeRequests.values()))
    }

    // ---- Auto-clean requests older than 60s ----
    const now = Date.now()
    for (const [id, req] of activeRequests.entries()) {
      if (now - req.start > 15_000) {
        activeRequests.delete(id)
        console.warn(
          `[MemoryGuardian] Auto-cleaned request ${id} (URL: ${req.url}) due to timeout`
        )
      }
    }
  }, 5_000)

  // ---- Track request lifecycle ----
  nitro.hooks.hook('request', (event) => {
    const id = ++reqId
    const url = event.node.req.url || '<unknown>'
    activeRequests.set(id, { start: Date.now(), url })

    return () => {
      try {
        activeRequests.delete(id)
      } catch (err) {
        console.error('[MemoryGuardian] Failed to remove request', err)
      }
    }
  })

  console.log('[MemoryGuardian] Server memory monitoring enabled.')
})
