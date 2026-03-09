import { defineStore } from "pinia";
import type { Support } from "@surf/nuxt-base/server/api/support/types";

interface ProgramRegistration {
  personaId: string;
  programId: string;
  support: Support[];
}

interface CourseRegistration {
  personaId: string;
  courseId: string;
  support: Support[];
}

interface PreviousEducation {
  awardingBody: string;
  title: string;
}

export const useRegistrationStore = defineStore("registration", {
  state: () => ({
    endOfDemo: false,
    isEnrolled: false,
    programs: [] as ProgramRegistration[],
    courses: [] as CourseRegistration[],
    previousEducation: [] as PreviousEducation[],
  }),
  getters: {
    getProgramIdsByPersonaId: (state) => (personaId: string) => {
      return [
        ...new Set(
          state.programs
            .filter((c: ProgramRegistration) => c.personaId === personaId)
            .map((c: ProgramRegistration) => c.programId),
        ),
      ];
    },
    getProgramRegistrationsByPersonaId: (state) => (personaId: string) =>
      state.programs.filter(
        (p: ProgramRegistration) => p.personaId === personaId,
      ),
    getCourseIdsByPersonaId: (state) => (personaId: string) => [
      ...new Set(
        state.courses
          .filter((c: CourseRegistration) => c.personaId === personaId)
          .map((c: CourseRegistration) => c.courseId),
      ),
    ],
    getCourseRegistrationsByPersonaId: (state) => (personaId: string) =>
      state.courses.filter(
        (c: CourseRegistration) => c.personaId === personaId,
      ),
  },
  actions: {
    loadRegistrationsFromCookies() {
      if (!import.meta.server) return;
      const headers = useRequestHeaders();
      if (!headers?.cookie) return;
      const parsedCookies = Object.fromEntries(
        headers.cookie.split("; ").map((c: string) => c.split("=")),
      );
      if (!parsedCookies.registration) return;
      const registration = JSON.parse(
        decodeURIComponent(parsedCookies.registration),
      );
      this.programs = registration.programs || [];
      this.courses = registration.courses || [];
    },
  },
  persist: {
    pick: [
      "isEnrolled",
      "programs",
      "courses",
      "endOfDemo",
      "previousEducation",
    ],
  },
});
