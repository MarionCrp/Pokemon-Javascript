function set_menu_element(pokemon_to_list){
  list = document.getElementById('menu-pokemons').getElementsByTagName('ul')[0];
  list_element = document.createElement("li");
  list_element.className = "menuElement";
  link = document.createElement("a");
  link.href = "#";
  link.addEventListener("click", function(){
    index = document.getElementById('pokemon-index');
    active_link(this);
    if(index.className == "to-hide"){
      actual_pokemon = document.getElementsByClassName('to-show')[0]
      hide(actual_pokemon);
      pokemon_to_show = document.getElementById('pokemon_' + pokemon_to_list.id);
      show(pokemon_to_show);
    } else {
      hide(index);
      pokemon_to_show = document.getElementById('pokemon_' + pokemon_to_list.id);
      show(pokemon_to_show);
    }
  });
  link.innerHTML = pokemon_to_list.name;
  if(document.getElementsByClassName('to-show')[0]){
    current_pokemon_name = document.getElementsByClassName('to-show')[0].getElementsByTagName('h2')[0].innerHTML
    if(pokemon_to_list.name == current_pokemon_name){
      link.className = "active-link";
      document.getElementsByClassName("menuElement")[0].getElementsByTagName('a')[0].className="";
    }
  }

  list_element.appendChild(link);
  list.appendChild(list_element);
}

function pokedex_link(){
  document.getElementById('pokedex_link').getElementsByTagName('a')[0].addEventListener('click', function() {
    active_link(this);
    while(document.getElementsByClassName('to-show').length > 0){
      hide(document.getElementsByClassName('to-show')[0]);
    }
    show(document.getElementById('pokemon-index'));
  });
}

function active_link(element){
  document.getElementsByClassName('active-link')[0].classList.remove('active-link');
  element.classList.add('active-link');
}

function active_link_from_picture(pokemon_name){
  document.getElementsByClassName('active-link')[0].classList.remove('active-link');
  links = document.getElementById('menu-pokemons').getElementsByTagName('a');
  for(i in links){
    if(links[i].innerHTML == pokemon_name){
      links[i].classList.add('active-link');
    }
  }
}

/// FORMULAIRE
// Génère les options du "select" "type"
function set_option_elements(types){
  select = document.getElementsByTagName('select').type;
  for(i in types){
    option = document.createElement('option')
    option.value = type_translate(types[i]);
    option.innerHTML = type_translate(types[i]);
    select.appendChild(option);
  }
}

function get_parameters(){
  var values = {};


  // GET PARAMS FROM SELECT
  select_fields = document.getElementsByTagName('select');
  for(i = 0; i < select_fields.length; i++){
    selected_option = select_fields[i].options[select_fields[i].selectedIndex].value;
    values[select_fields[i].name] = selected_option;
  }

  values['words'] = document.getElementsByName('word')[0].value;
  return values;
}

function filter(parameters){
  requested_string = parameters['words'];
  // On sélectionne les lignes du tableau correspondant aux pokemon
  rows = document.getElementById('pokedex').querySelectorAll("tr:not(.main_line)");
  parse_and_search_requested_string(requested_string, rows);
}

function on_submit(){
  // On vide notre tableau d'erreur au cas où il en contiendrait.
  errors = [];
  submit_button = document.getElementsByTagName('input').chercher;
  submit_button.addEventListener('click', function(){
  hide_current_shown_pokemon();
  show(document.getElementById("pokemon-index"));
  parameters = get_parameters();
  filter(parameters);
  if(errors.length > 0) alert(errors[0]);
  });
}
