import * as ui from "../ui/ui";
import * as session from "./session";
import * as app from "./app";
import * as events from "../app/events";
import $ from "jquery";
import * as data from "./../data/data";
import * as autocomplete from "./../ui/autocomplete/autocomplete";
import { sanitize } from "dompurify";

/** handles navigation between screens  */

const screens = {
  landing: {},
  connect: {},
  reset_password: {},
  inscription1: { next: "inscription2", back: "landing" },
  inscription2: { next: "inscription_tunnel_statut", back: "inscription1" },
  recherche: {},
  board: {},
  selection: {},
  groupes: {},
  profil: {},
  inscription_tunnel_statut: { next: "inscription_tunnel_scolarite" },
  inscription_tunnel_scolarite: {
    next: "inscription_tunnel_domaines_pro",
    back: "inscription_tunnel_statut",
  },
  inscription_tunnel_domaines_pro: {
    next: "inscription_tunnel_interests",
    back: "inscription_tunnel_scolarite",
  },
  inscription_tunnel_interests: {
    next: "inscription_tunnel_metiers",
    back: "inscription_tunnel_domaines_pro",
  },
  inscription_tunnel_metiers: {
    next: "inscription_tunnel_etudes",
    back: "inscription_tunnel_interests",
  },
  inscription_tunnel_etudes: {
    next: "inscription_tunnel_felicitations", //"inscription_formations",
    back: "inscription_tunnel_metiers",
  },
  inscription_tunnel_formations: {
    next: "inscription_tunnel_felicitations",
    back: "inscription_tunnel_etudes",
  },
  inscription_tunnel_felicitations: {},
};

export async function setScreen(screen) {
  console.log("setScreen", screen);
  if (screen == null) {
    session.saveScreen(null);
  } else if (screen in screens) {
    let current_screen = session.getScreen();
    screen = await doTransition(current_screen, screen);
    $(`#nav-${screen}`).attr("aria-current", true);
    init_main_nav();
  }
}

function next(current_screen) {
  if (!current_screen in screens) return undefined;
  return screens[current_screen]?.next;
}
function back(current_screen) {
  if (!current_screen in screens) return undefined;
  return screens[current_screen]?.back;
}

async function doTransition(old_screen, new_screen) {
  const result = await exitScreen(old_screen);
  let screen = session.getScreen();
  if (result) {
    await enterScreen(new_screen);
    screen = new_screen;
    app.logAction("doTransition " + old_screen + " --> " + new_screen);
    session.saveScreen(screen);
  }
  const nextScreen = next(screen);
  const backScreen = back(screen);
  $("#nextButton").toggle(nextScreen !== undefined);
  $("#backButton").toggle(backScreen !== undefined);
  if (nextScreen)
    $("#nextButton")
      .off("click")
      .on("click", async () => {
        await setScreen(nextScreen);
      });
  if (backScreen)
    $("#backButton")
      .off("click")
      .on("click", async () => {
        await setScreen(backScreen);
      });
  return screen;
}

export function init_main_nav() {
  $(".set-screen")
    .off("click")
    .on("click", async function () {
      const screen = $(this).attr("screen");
      $(this).attr("aria-current", true);
      await setScreen(screen);
    });
  $(".visible-only-when-connected").show();
  $(".visible-only-when-disconnected").hide();

  const screen = session.getScreen();
  if (screen) {
    $(".hidden-during-inscription").toggle(!screen.includes("inscription"));
  } else {
    $(".hidden-during-inscription").show();
  }

  $(".disconnect")
    .off()
    .on("click", async function () {
      app.disconnect();
      $(".visible-only-when-connected").hide();
      $(".visible-only-when-disconnected").show();
    });
  $(".recherche")
    .off()
    .on("click", async function () {
      await setScreen("recherche");
    });
  $(".monespace")
    .off()
    .on("click", async function () {
      await setScreen("profil");
    });
  $(".prenomnom").html(data.getPrenomNom());
}

async function updateRecherche() {
  let str = $("#search-784-input").val();
  if (str === null || str === undefined) str = "";
  ui.showWaitingMessage();
  const msg = await app.doSearch(str);
  const showAffinities = str == "";
  ui.showRechercheData(msg.details, showAffinities);
  $("#search-button").off("click").on("click", updateRecherche);
  $("#search-784-input").on("keypress", function (event) {
    // Check if the key pressed is Enter
    if (event.key === "Enter") {
      updateRecherche();
    }
  });

  $("#formation-details-header-nav-central-icon")
    .off("click")
    .on("click", function () {
      const id = $(this).attr("data-id");
      events.changeSuggestionStatus(id, data.SUGG_APPROVED, () =>
        ui.updateFav(id)
      );
    });
  $(".add-to-favorites-btn")
    .off("click")
    .on("click", function () {
      const id = $(this).attr("data-id");

      $(this).html("Ajouté à ma sélection");
      $(this).addClass("activated");
      $(this).addClass("favori");

      events.changeSuggestionStatus(id, data.SUGG_APPROVED, () =>
        ui.updateFav(id)
      );
    });
  $(".add-to-bin-btn")
    .off("click")
    .on("click", function () {
      const id = $(this).attr("data-id");
      events.changeSuggestionStatus(id, data.SUGG_REJECTED, () =>
        ui.updateFav(id)
      );
    });
}
async function updateSelection() {
  ui.showWaitingMessage();
  const msg = await app.getSelection();
  ui.showFavoris(msg.details);
  $(".add-to-favorites-btn")
    .off("click")
    .on("click", function () {
      const id = $(this).attr("data-id");

      $(this).html("Ajouté à ma sélection");
      $(this).addClass("activated");
      $(this).addClass("favori");

      events.changeSuggestionStatus(id, data.SUGG_APPROVED, () =>
        ui.updateFav(id)
      );
    });

  $(".add-to-bin-btn")
    .off("click")
    .on("click", function () {
      const id = $(this).attr("data-id");
      events.changeSuggestionStatus(id, data.SUGG_REJECTED, async () => {
        ui.updateFav(id);
        const msg = await app.getSelection();
        ui.showFavoris(msg.details);
      });
    });
}

function profileEditionSetup() {
  setUpAutoComplete("spe_classes", 0);
  setUpAutoComplete("metiers", 0);
  setUpAutoComplete("geo_pref", 2);
  setUpMultiChoices();
  setUpSelects();
}

function setUpInscription(screen) {
  ui.setupSelects(screen, "#myTabContent");
  profileEditionSetup();
  if (screen == "metiers") {
    $(".profile_tab .autocomplete_group").hide();
    $(".metier-toggler")
      .off()
      .on("click", function () {
        $(".profile_tab .autocomplete_group").toggle(
          $("#radio-rich-metier-identifie").is(":checked")
        );
      });
  }
}

const screen_enter_handlers = {
  landing: async () => await ui.showLandingScreen(),
  recherche: async () => {
    await ui.showRechercheScreen();
    init_main_nav();
    $("#search-784-input").val("");
    await updateRecherche();
  },
  board: async () => {
    await ui.showBoard();
    const prenom = data.getPrenom();
    $(".ravi-div-prenom").html(prenom);
    init_main_nav();
  },
  selection: async () => {
    await ui.showSelection();
    init_main_nav();
    await updateSelection();
  },
  inscription1: async () => await ui.showInscriptionScreen1(),
  inscription2: async () => await ui.showInscriptionScreen2(),
  groupes: async () => {
    refreshGroupTab(false);
    ui.showGroupsTab();
  },
  profil: async () => {
    await app.getProfile();
    await ui.showProfileScreen();
    profileEditionSetup();
    init_main_nav();
  },
  inscription_tunnel_statut: async () => {
    await ui.showTunnelScreen("statut");
    setUpInscription("statut");
  },
  inscription_tunnel_scolarite: async () => {
    await ui.showTunnelScreen("scolarite");
    setUpInscription("scolarite");
  },
  inscription_tunnel_domaines_pro: async () => {
    await ui.showTunnelScreen("domaines_pro");
    setUpInscription("domaines_pro");
  },
  inscription_tunnel_interests: async () => {
    await ui.showTunnelScreen("interests");
    setUpInscription("interests");
  },
  inscription_tunnel_metiers: async () => {
    await ui.showTunnelScreen("metiers");
    setUpInscription("metiers");
  },
  inscription_tunnel_etudes: async () => {
    await ui.showTunnelScreen("etudes");
    setUpInscription("etudes");
  },
  inscription_tunnel_formations: async () => {
    await ui.showTunnelScreen("formations");
    setUpInscription("formations");
  },
  inscription_tunnel_felicitations: async () => {
    await ui.showTunnelScreen("felicitations");
    $("#discover_button")
      .off()
      .on("click", () => {
        setScreen("board");
      });
  },
};
const screen_exit_handlers = {
  inscription1: async () => await validateInscription1(),
  inscription2: async () => await validateInscription2(),
};

function setUpMultiChoices() {
  //multi-options-item
  $(".multi-options-item")
    .off()
    .on("click", function () {
      const key = $(this).attr("key");
      events.toggleProfileScoreHandler(key);
      const selected = data.isSelected(key);
      $(this).toggleClass("selected", selected);
    });
}

function setUpAutoComplete(id, threshold) {
  data.updateAutoComplete();

  const addHandler = (key, label, value) => {
    ui.clearAutoComplete(id);
    events.addElementToProfileListHandler(id, key, label);
  };

  const trashHandler = (label) => {
    ui.clearAutoComplete(id);
    if (id == "metiers" || id == "formations") {
      const sugg = data.getApprovedSuggestionWithLabel(label);
      if (sugg != undefined && sugg != null) {
        events.changeSuggestionStatus(sugg.fl, data.SUGG_REJECTED);
      }
    } else {
      events.removeElementFromProfileList(id, label);
    }
  };

  const feedbackHandler = (resultNb, lookupLength, lookupLengthThreshold) =>
    autoCompleteFeedbackHandler(
      id,
      resultNb,
      lookupLength,
      lookupLengthThreshold
    );

  const updateListHandler = (listeItems) => {
    ui.updateAutoCompleteItemsListe(id, listeItems);
    $(`.autoCompleteItem`).on("click", function () {
      const key = $(this).attr("key");
      const label = $(this).attr("label");
      addHandler(key, label);
      //events.addElementToProfileListHandler(id, key, label);
      $(this).remove();
      autocomplete.updateAutoCompleteListItem(id, trashHandler);
    });
  };

  const show = autocomplete.setUpAutoComplete(
    id,
    addHandler,
    trashHandler,
    feedbackHandler,
    threshold,
    updateListHandler
  );
  if (id === "spe_classes") {
    $("#autocomplete_group_spe_classes").toggle(show);
  }
}

function setUpSelects() {
  const selects = {
    niveau: "#profile-tab-scolarite-classe-select",
    bac: "#profile-tab-scolarite-bac-select",
    duree: "#profile-tab-etudes-duree-select",
    apprentissage: "#profile-tab-etudes-app-select",
  };
  for (const key in selects) {
    const id = selects[key];
    setSelectVal(id, data.getProfileValue(key));
  }
  $(".profile-select")
    .off()
    .on("change", function () {
      const key = $(this).attr("key");
      const val = $(this).val();
      events.profileValueChangedHandler2(key, val);
      if (key == "bac") {
        setUpAutoComplete("spe_classes", 0);
      }
    });
  /*
  $(".save-profile-button").on("click", function () {
    const pf = {};
    const category = $(this).attr("category");
    if (category === "scolarite") {
      const classe = getSelectVal("#profile-tab-scolarite-classe-select");
      const bac = getSelectVal("#profile-tab-scolarite-bac-select");
      events.profileValueChangedHandler2("niveau", classe);
      events.profileValueChangedHandler2("bac", bac);
    }
    if (category === "etudes") {
      const duree = getSelectVal("#profile-tab-etudes-duree-select");
      const app = getSelectVal("#profile-tab-etudes-app-select");
      events.profileValueChangedHandler2("duree", duree);
      events.profileValueChangedHandler2("apprentissage", app);
    }
  });*/
}

function autoCompleteFeedbackHandler(
  id,
  resultNb,
  lookupLength,
  lookupLengthThreshold
) {
  const feedbackDom = $(`#${id}_autocomplete_feedback`);
  feedbackDom.removeClass("text-success");
  feedbackDom.removeClass("text-warning");
  feedbackDom.removeClass("text-danger");
  if (resultNb == 0 && lookupLength == 0) {
    feedbackDom.html("&nbsp;");
  } else if (resultNb == 0 && lookupLength < lookupLengthThreshold) {
    feedbackDom.addClass("text-warning");
    feedbackDom.html("Mot trop court");
  } else if (resultNb == 0 && lookupLength >= lookupLengthThreshold) {
    feedbackDom.addClass("text-danger");
    feedbackDom.html("Aucun résultat");
  } else if (resultNb == 1) {
    feedbackDom.html(`1 résultat`);
  } else if (resultNb > 1) {
    feedbackDom.html(`${resultNb} résultats`);
  }
}

async function enterScreen(screen) {
  if (screen in screen_enter_handlers && screen_enter_handlers[screen]) {
    await screen_enter_handlers[screen]();
  } else {
    ui.showLandingScreen();
  }
}
async function exitScreen(screen) {
  if (screen in screen_exit_handlers) {
    if (screen_exit_handlers[screen]) {
      const result = await screen_exit_handlers[screen]();
      return result;
    }
  }
  return true;
  //default behaviour: None
}

let accounType = null;
let accessGroupe = null;

async function validateInscription1() {
  $(".fr-messages-group").empty();

  accessGroupe = $("#inputCreateAccountCodeAcces").val();
  const lyceen = $("#radio-create-account-lyceen").is(":checked");
  const pp = $("#radio-create-account-prof").is(":checked");
  accounType = lyceen ? "lyceen" : "pp";
  if (!lyceen && !pp) {
    $("#inscription1-messages").html(
      `<p class="fr-alert fr-alert--error">Veuillez choisir un type de compte</p>`
    );
    return false;
  } else if (accessGroupe == null || accessGroupe.length <= 0) {
    $("#inscription1-messages2").html(
      `<p class="fr-alert fr-alert--error">Veuillez indiquer un code d'accès</p>`
    );
    return false;
  } //récupérer type de compte et mot de passe
  const msg = await app.validateCodeAcces(accounType, accessGroupe);
  if (!msg.ok) {
    $("#inscription1-messages2").html(
      `<p class="fr-alert fr-alert--error">Le code d'accès '${sanitize(
        accessGroupe
      )}' est erroné</p>`
    );
  }
  return msg.ok;
}

async function validateInscription2() {
  //const accounType = $("#createAccountSelectType").val();
  const nom = $("#champNom").val();
  const prenom = $("#champPrenom").val();
  const identifiant = $("#champIdentifiant").val();
  const mdp = $("#champMdp").val();
  const mdp2 = $("#champMdp2").val();
  const rgpd = $("#checkbox-rgpd").is(":checked");

  const pattern = /^[a-zA-Z0-9+_.\-@]+$/;

  $("#champIdentifiant-messages").empty();
  $("#champMdp-messages").empty();
  $("#champMdp2-messages").empty();
  if (mdp != mdp2) {
    $("#champMdp2-messages").html(
      `<p class="fr-alert fr-alert--error">Les mots de passe ne sont pas identiques.</p>`
    );
  } else if (mdp == accessGroupe) {
    $("#champMdp-messages").html(
      `<p class="fr-alert fr-alert--error">Le mot de passe (privé et personnel) doit être différent du code d'accès au groupe (public).</p>`
    );
  } else if (
    identifiant === undefined ||
    identifiant === null ||
    identifiant.length == 0
  ) {
    $("#champIdentifiant-messages").html(
      `<p class="fr-alert fr-alert--error">Identifiant non renseigné</p>`
    );
  } else if (!pattern.test(identifiant)) {
    $("#champIdentifiant-messages").html(
      `<p class="fr-alert fr-alert--error">Les identifiants autorisés ne comportent que des lettres, des chiffres et les symboles +_.-@</p>`
    );
  } else if (mdp === undefined || mdp === null || mdp.length == 0) {
    $("#champMdp-messages").html(
      `<p class="fr-alert fr-alert--error">Mot de passe non renseigné</p>`
    );
  } else if (!rgpd) {
    $("#checkbox-rgpd-messages").html(
      `<p class="fr-alert fr-alert--error">Vous devez accepter les conditions d'utilisation</p>`
    );
  } else {
    $("#champMdp").val("");
    $("#champMdp2").val("");
    session.saveScreen(null);
    await app.createAccount({
      nom: nom,
      prenom: prenom,
      type: accounType,
      login: identifiant,
      accesGroupe: accessGroupe,
      password: mdp,
    });
    return false;
  }
  return false;
}

function getSelectVal(id) {
  const val = $(id).val();
  if (val === null) return "";
  return val;
}
function setSelectVal(id, val) {
  $(id).val(val);
}
