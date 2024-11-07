import { dépendances } from "@/configuration/dépendances/dépendances";
import { queryClient } from "@/configuration/lib/tanstack-query";
import { type Élève } from "@/features/élève/domain/élève.interface";
import { queryOptions } from "@tanstack/react-query";

export const élèveQueryOptions = queryOptions({
  queryKey: ["élève"],
  queryFn: async () => {
    const réponse = await dépendances.récupérerProfilÉlèveUseCase.run();

    if (réponse instanceof Error) throw réponse;

    return réponse;
  },
});

queryClient.setMutationDefaults(["mettreÀJourÉlève"], {
  mutationFn: async (élève: Élève) => {
    const réponse = await dépendances.mettreÀJourProfilÉlèveUseCase.run(élève);

    if (réponse instanceof Error) throw réponse;

    return réponse;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries(élèveQueryOptions);
  },
});
