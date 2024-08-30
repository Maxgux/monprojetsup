import { récupérerFormationQueryOptions } from "@/features/formation/ui/formationQueries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/formations/$formationId/")({
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(récupérerFormationQueryOptions(params.formationId));
  },
});