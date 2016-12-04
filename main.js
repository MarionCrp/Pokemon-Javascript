// ONLOAD
window.addEventListener("load", function() {
  // VARIABLES GLOBALES :
    var parameters;
    var errors = [];

    // BOUTONS DU FORMULAIRE DE RECHERCHE :
    var submit_button = document.getElementsByTagName('input').chercher;
    var reinitialize_button = document.getElementsByTagName('input').reinitialize;

  // On parle le JSON et on créé les objets sur la page.
  parseJson();

  on_click_pokedex_link();

  // EVENT LISTENERS
  submit_button.addEventListener('click', function(){
    on_filter_submit(); // menu.js
  });
  reinitialize_button.addEventListener('click', function(){
    on_reinitialize(); // menu.js
  });
});

function parseJson(){
  var req = new XMLHttpRequest();
  req.open("GET", "pokemons.json", true);
  req.onerror = function(){
    console.log("Echec de chargement du fichier pokemons.json");
  }
  req.onreadystatechange = (function(){
    if(req.readyState == 4 && (req.status == 200 || req.status == 0)){
      var Data = JSON.parse(req.responseText);

      set_pokemons(Data["pokemons"]);
    }
  });
  req.send(null);
}

// Création des éléments avec les données présentes dans le JSON.
function set_pokemons(data_pokemons){
  var types = []; // Où on stock les différents types pour les mettres dans le select du formulaire.
  for(var pokemon in data_pokemons){
    var attributes = data_pokemons[pokemon];

    // On instancie également les pokemons relatifs aux évolutions.
    var evolutions = [];
    var family_size = attributes.family.length;
    var evol_found = 0;
    for(var i in data_pokemons){
      // On compare l'id du pokemon de la liste avec les id des évolutions du pokemon selectionné.
      for(var j in attributes.family){
        if(data_pokemons[i].id == attributes.family[j]){
          evol_attributes = data_pokemons[i];
          evolutions.push(new Pokemon(evol_attributes.id,
                                      evol_attributes.name,
                                      evol_attributes.type,
                                      evol_attributes.picture));
        evol_found += 1;
        }
      }

      var pokemon_to_create = new Pokemon(attributes.id,
                                        attributes.name,
                                        attributes.type,
                                        attributes.picture,
                                        attributes.href,
                                        attributes.description,
                                        attributes.weight,
                                        attributes.height,
                                        attributes.special_capacities,
                                        evolutions);
   }

   // On rempli le tableau de pokemon
   set_in_index(pokemon_to_create); // build_elements.js

   // On créé et rempli les fiches détaillées
   set_in_details(pokemon_to_create); // build_elements.js

    // On liste les différents types de pokemon
   set_menu_element(pokemon_to_create); // build_elements.js

   // On ajoute le type du pokemon s'il n'a pas déjà été répertorié
   if(types.indexOf(pokemon_to_create.type) === -1 ){
     types.push(pokemon_to_create.type);
   }
  }
  // On rempli les options du select "type" possibles dans le formulaire :
  set_option_elements(types);
}

// FONCTIONNALITE D'AFFICHAGE OU DE NON AFFICHAGE DES ELEMENTS.

function hide(element){
    element.classList.add('to-hide');
    if(element.classList.contains('to-show')){
       element.classList.remove('to-show');
    }
}

function hide_current_shown_pokemon(){
  var current_pokemon_to_hide = document.getElementById("pokemon_details").getElementsByClassName("to-show")[0];
  if(current_pokemon_to_hide){
    hide(document.getElementById("pokemon_details").getElementsByClassName("to-show")[0]);
  }
}

function hide_all_show_pokemon(){
    var show_pokemons = document.getElementById("pokemon_details").getElementsByClassName("to-show");
    for(var i = 0; i < show_pokemons.length; i++){
      hide(show_pokemons[i]);
    }
}

function show(element){
  element.classList.add('to-show');
  if(element.classList.contains('to-hide')){
     element.classList.remove('to-hide');
  }
}

function show_all_pokemon_in_pokedex(){
  var pokedex_rows = document.getElementById('pokedex').querySelectorAll("tr:not(.main_line)");
  for(var i = 0; i < pokedex_rows.length; i++){
    show(pokedex_rows[i]);
  }
}

// ACTIONS RELATIVES AUX LIENS DU MENU

function active_link(element){
  document.getElementsByClassName('active-link')[0].classList.remove('active-link');
  element.classList.add('active-link');
}

function active_link_from_picture(pokemon_name){
  document.getElementsByClassName('active-link')[0].classList.remove('active-link');
  var links = document.getElementById('menu-pokemons').getElementsByTagName('a');
  for(i in links){
    if(links[i].innerHTML == pokemon_name){
      links[i].classList.add('active-link');
    }
  }
}

function on_click_pokedex_link(){
  // Lorsque l'utilisateur clique sur le lien vers le pokedex
  document.getElementById('pokedex_link').getElementsByTagName('a')[0].addEventListener('click', function() {
    active_link(this);

    // On réinitialise la page en cachant tous les éléments éventuellement visible sur la page et réaffiche que le pokedex (pokemon-index)
    while(document.getElementsByClassName('to-show').length > 0){
      hide(document.getElementsByClassName('to-show')[0]);
    }
    show(document.getElementById('pokemon-index'));

    //
    on_filter_submit();
  });
}
