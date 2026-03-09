<template>
    <div
        v-if="issueOptions?.length"
        class="download"
    >
        <div class="download-button-container">
            <div
              v-if="issueOptions.includes('verifiable-credential')"
              class="add-to-wallet"
            >
                <UButton
                    :to="issueUrl"
                    :icon="issuedAt ? 'i-heroicons-check-circle-solid' : 'i-mdi-wallet-bifold-outline'"
                    :class="{ 'add-to-wallet-button--added' : issuedAt }"
                    class="add-to-wallet-button"
                    block
                    :trailing="false"
                    :color="issuedAt ? 'white' : 'green'"
                    :label="$t(issuedAt ? 'added_to_wallet' : 'add_to_wallet')"
                    variant="solid"
                />
            </div>
            <UDropdown
                v-if="issueItems.length"
                :items="issueItems"
                :popper="{ placement: 'bottom-end' }"
                :ui="{
                    width: 'w-72',
                }"
            >
                <UButton
                    color="white"
                    icon="i-heroicons-ellipsis-horizontal"
                />
                <template #item="{ item }">
                    <SvgoDownloadBottom
                        v-if="item.icon === 'SvgoDownloadBottom'"
                        class="download-icon"
                        :fontControlled="false"
                    />
                    <SvgoOfficeFilePdf1
                        v-if="item.icon === 'SvgoOfficeFilePdf1'"
                        class="download-icon"
                        :fontControlled="false"
                    />
                    <SvgoPrintText
                        v-if="item.icon === 'SvgoPrintText'"
                        class="download-icon"
                        :fontControlled="false"
                    />
                    <span>{{ $t(item.label) }}</span>
                </template>
            </UDropdown>
        </div>
    </div>

    <div v-if="isPresentable">
        <div class="update-via-wallet">
            <UButton
                :to="presentationUrl"
                variant="outline"
                label="Update via Wallet"
                icon="i-mdi-wallet-bifold-outline"
                class="update-via-wallet-button"
                block
            />
        </div>
    </div>
    <WalletCta v-if="isWalletCtaDisplayed" />
</template>

<script setup lang="ts">
import SvgoOfficeFilePdf1 from '~/assets/icons/office-file-pdf-1.svg';
import SvgoDownloadBottom from '~/assets/icons/download-bottom.svg';
import SvgoPrintText from '~/assets/icons/print-text.svg';
import type { DropdownItem } from '#ui/types';

const props = defineProps<{
  presentationUrl?: string;
  issueUrl?: string;
  issueOptions?: string[];
  issuedAt?: Date;
  isPresentable?: boolean;
  isWalletCtaDisplayed?: boolean;
}>();

const { locale } = useI18n()

const issueItems = computed(() => {
  const items: DropdownItem[] = [];

  if (!props.issueOptions) return items;

  if (props.issueOptions.includes('verifiable-credential-download')) {
    items.push({
      icon: 'SvgoDownloadBottom',
      label: 'download.as_verifiable_credential',
    })
  }
  
  if (props.issueOptions.includes('signed-pdf')) {
    items.push({
      icon: 'SvgoOfficeFilePdf1',
      label: 'download.as_signed_pdf',
    })
  }
  
  if (props.issueOptions.includes('print')) {
    items.push({
      icon: 'SvgoPrintText',
      label: 'print',
    })
  }

  return items;
});
</script>

<style lang="css" scoped>
.download {
  @apply
    flex
    flex-col
    gap-3
  ;
}

.download-button-container {
  @apply
    flex
    gap-3
  ;
}

.update-via-wallet
.add-to-wallet {
  @apply
    basis-60
    sm:max-w-60
  ;
}

.add-to-wallet-button,
.update-via-wallet-button {
  @apply
    flex
    justify-center
    whitespace-nowrap
  ;
}

.add-to-wallet-button--added {
  @apply
    text-green-600
  ;
}

.update-via-wallet-button {
  @apply
    bg-white
    hover:bg-white
  ;
}

.download-icon {
  @apply w-4;
}
</style>