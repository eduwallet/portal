import { VerifiableCredentialStorage } from "./types";
import { Iam, Sis } from "../types";

interface Res {
  status: string;
  result: any;
}

interface PersonaRes {
  iam: Iam[];
  sis: Sis[];
}

const SECRET_KEY = process.env.JWT_SECRET || "not-the-key";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = body;

  if (!id) {
    return {
      status: "ERROR",
      result: "_notifications.error.api.pid.id_required",
    };
  }

  const storage = useStorage();

  const exists = await storage.hasItem(`fs:${id}.json`);

  if (!exists) {
    return {
      status: "ERROR",
      result: "_notifications.error.api.edc.credential_not_found",
    };
  }

  try {
    const data = await storage.getItem<VerifiableCredentialStorage>(
      `fs:${id}.json`,
    );

    const verifierToken = process.env.NUXT_VERIFIER_TOKEN || "";

    const res: Res = await $fetch(data!.checkUri, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${verifierToken}`,
      },
    });

    if (res.status !== "RESPONSE_RECEIVED") {
      return {
        status: res.status,
      };
    }

    const claim =
      res.result.credentials.EuropeanDigitalCredential[0].claims.hasClaim[0];
    const awardingBody = Object.values(
      claim.awardedBy.awardingBody[0].legalName,
    )[0][0];
    const title = Object.values(claim.specifiedBy.title)[0][0];

    if (!awardingBody) {
      return {
        status: "ERROR",
        result: "_notifications.error.api.edc.no_awarding_body_in_credential",
      };
    }

    if (!title) {
      return {
        status: "ERROR",
        result: "_notifications.error.api.edc.no_title_in_credential",
      };
    }

    await storage.removeItem(`fs:${id}.json`);

    return {
      status: res.status,
      title,
      awardingBody,
    };
  } catch (error: unknown) {
    console.log(error);

    if ("statusMessage" in error) throw error;

    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error
          ? error.message
          : "_notifications.error.api.server_error",
    });
  }
});
