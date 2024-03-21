package fr.gouv.monprojetsup.data.update;

import fr.gouv.monprojetsup.data.DataSources;
import fr.gouv.monprojetsup.data.model.cities.CitiesBack;
import fr.gouv.monprojetsup.data.model.cities.CitiesLoader;
import fr.gouv.monprojetsup.data.update.psup.MergeDuplicateTags;
import fr.gouv.monprojetsup.data.update.psup.PsupData;
import fr.gouv.monprojetsup.tools.Serialisation;
import fr.gouv.monprojetsup.data.update.onisep.OnisepData;
import fr.gouv.monprojetsup.data.update.rome.RomeData;

import java.io.IOException;
import java.util.logging.Logger;

public class UpdateBackData {

    private static final Logger LOGGER = Logger.getLogger(UpdateBackData.class.getSimpleName());

    public static void main(String[] args) throws IOException {

        LOGGER.info("Chargement de " + DataSources.CITIES_FILE_PATH);
        CitiesBack cities = CitiesLoader.loadCitiesBack();

        LOGGER.info("Chargement de " + DataSources.getSourceDataFilePath(DataSources.BACK_PSUP_DATA_FILENAME));
        PsupData psupData = Serialisation.fromZippedJson(DataSources.getSourceDataFilePath(DataSources.BACK_PSUP_DATA_FILENAME), PsupData.class);
        psupData.cleanup();

        LOGGER.info("Chargement des données Onisep");
        OnisepData onisepData = OnisepData.fromFiles();

        LOGGER.info("Chargement des données ROME");
        RomeData romeData = RomeData.load();
        onisepData.insertRomeData(romeData.centresInterest());

        LOGGER.info("Enregistrement des données dans " + DataSources.getBackDataFilePath());
        BackEndData data = new BackEndData(psupData, onisepData, cities, romeData);

        Serialisation.toZippedJson(DataSources.getBackDataFilePath(), data, true);

        // Clean keywords (tagsSources.json).
        MergeDuplicateTags.main(args);
    }

}
