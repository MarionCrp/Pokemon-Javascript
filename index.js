// INDEX PRESENTATION
function set_pokemon_nb(pokemons){
    pokemon_nb = pokemons.length;
    document.getElementById("pokemon_nb").innerHTML = pokemon_nb;
}

// INDEX POKEDEX
function set_pokedex(data_pokemons){
  var tab_body = document.getElementsByTagName("tbody")[0];
  var types = [];
  for(pokemon in data_pokemons){
    attributes = data_pokemons[pokemon];

    // On instancie les pokemons relatifs aux évolutions du pokemon selectionné.
    var evolutions = [];
    var family_size = attributes.family.length;
    var evol_found = 0;
    for(i in data_pokemons){
      // On compare l'id du pokemon de la liste avec les id des évolutions du pokemon selectionné.
      for(j in attributes.family){
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
                                        attributes.gender,
                                        attributes.weight,
                                        attributes.height,
                                        attributes.special_capacities,
                                        evolutions);
   }
   tab_body.appendChild(create_pokemon_row(pokemon_to_create));

   // On liste les différents types de pokemon
   if(types.indexOf(pokemon_to_create.type) === -1 ){
     types.push(pokemon_to_create.type);
   }
   set_show(pokemon_to_create);
   set_menu_element(pokemon_to_create);
  }

  // On rempli les options du select "type" possibles dans le formulaire :
  //
  set_option_elements(types);
}

function create_pokemon_row(pokemon){
  var pokemon_row = document.createElement("tr");
  var attributes = ['id', 'type', 'picture', 'name', 'height', 'weight', 'description'];
  for(var i = 0; i < attributes.length; i++){
    var cell = document.createElement("td");
    cell.innerHTML = pokemon[attributes[i]];
    set_property_row_attributes(attributes[i], cell, pokemon);
    pokemon_row.appendChild(cell);
  }
  return pokemon_row;
}

function set_property_row_attributes(property, cell, pokemon){
  switch (property) {
    case 'type':
      cell.className = pokemon.type;
      var content = cell.firstChild;
      cell.innerHTML = type_translate(cell.innerHTML); // On traduit les données de type en français
      var wrapper = document.createElement("span");
      cell.replaceChild(wrapper, content)
      wrapper.appendChild(content);
      break;

    case 'picture':
      var content = cell.firstChild;
      var src = cell.innerHTML;
      var link = document.createElement("a");
      //Cette valeur ne sert plus à rien comme on utilise window.open().
      // Voir dernière ligne de ce case.
      link.href = "#";
      var picture = document.createElement("img");
      picture.src = src;
      picture.alt = pokemon.name;
      picture.width = 100;
      link.appendChild(picture);
      cell.replaceChild(link, content);
      cell.addEventListener("click",function(event){
        pokemon_to_show = document.getElementById("pokemon_" + pokemon.id)
        active_link_from_picture(pokemon.name);
        hide(document.getElementById("pokemon-index"))
        show(pokemon_to_show);
      });

    default:
      break;
  }
}

function parseJson(){
  var req = new XMLHttpRequest();
  req.open("GET", "pokemons.json", true);
  req.onerror = function(){
    console.log("Echec de chargement du fichier pokemons.json");
  }
  req.onreadystatechange = (function(){
    if(req.readyState == 4 && (req.status == 200 || req.status == 0)){
      var Data = JSON.parse(req.responseText);
      set_pokemon_nb(Data["pokemons"]);
      set_pokedex(Data["pokemons"]);
    } else {
      //alert("Not ready yet");
    }
  });
  req.send(null);
}

function set_show(selected_pokemon){

  // Intégration de la description princpale
  div_principale = document.createElement('div');
  div_principale.id = "pokemon_" + selected_pokemon.id;
  hide(div_principale);
  title = document.createElement('h2');
  title.innerHTML = selected_pokemon.name;
  page_body = document.createElement('div');
  page_body.className = "page-bodys";
  content = document.createElement('div');
  content.className = "content";
  article = document.createElement('article');
  article.className = "main-desc";

  section = document.createElement('section');
  section.appendChild(title);

  // Intégration de l'image
  div_image = document.createElement('div');
  image = document.createElement('img');
  image.src =  selected_pokemon.picture;
  image.alt = selected_pokemon.name;
  image.width = "100";
  div_image.appendChild(image);

  // Intégration de la description
  div_description = document.createElement('div');
  div_description.className = "description";
  description_label = document.createElement('h3');
  description_label.innerHTML = "Description";
  description_content = document.createElement('p');
  description_content.innerHTML = selected_pokemon.description;
  div_description.appendChild(description_label);
  div_description.appendChild(description_content);
  section.appendChild(div_image);
  section.appendChild(div_description);
  article.appendChild(section);

  // Intégration des caractéristiques :
  section_carac = document.createElement('section')
  section_carac.className = "caracteristics";
  title_carac = document.createElement('h3');
  title_carac.innerHTML = "Caractéristiques";
  ul_carac = document.createElement('ul');
  item_id = document.createElement('li');
  item_id.innerHTML = "<spans>N°: </spans>" + selected_pokemon.id;
  item_type = document.createElement('li');
  item_type.innerHTML = "<spans>Type: </spans>" + type_translate(selected_pokemon.type);
  item_gender = document.createElement('li');
  item_gender.innerHTML = "<spans>Sexe: </spans>" + selected_pokemon.gender;
  item_height = document.createElement('li');
  item_height.innerHTML = "<spans>Taille: </spans>" + selected_pokemon.height;
  item_weight = document.createElement('li');
  item_weight.innerHTML = "<spans>Poids: </spans>" + selected_pokemon.weight;

  for(i in item_attributes = [item_id, item_type, item_gender, item_height, item_weight]){
    ul_carac.appendChild(item_attributes[i]);
  }

  section_carac.appendChild(title_carac);
  section_carac.appendChild(ul_carac);
  article.appendChild(section_carac);

  // Intégration des capacités spéciales
  section_spec_capacities = document.createElement('section');
  section_spec_capacities.className = "special_capacities";
  title_capacity = document.createElement('h3');
  title_capacity.innerHTML = "Capacités Spéciales";
  ul_capacities = document.createElement('ul');

  special_capacities = selected_pokemon.special_capacities
  for(i in special_capacities) {
    item = document.createElement('li')
    item.innerHTML = ('<span>' + special_capacities[i]['title'] + ' : </span>' + [special_capacities[i]['description']]);
    ul_capacities.appendChild(item);
    ul_capacities.appendChild(document.createElement('br'));
  }

  section_spec_capacities.appendChild(title_capacity);
  section_spec_capacities.appendChild(ul_capacities);
  article.appendChild(section_spec_capacities);

  // Intégration du aside
  aside = document.createElement('aside');
  title_evol = document.createElement('h3');
  aside.appendChild(title_evol)

  if(selected_pokemon.family.length > 1){
    title_evol.innerHTML = "Evolutions";
  } else {
    title_evol.innerHTML = "Evolution";
  }

  for(i in selected_pokemon.family){ (function(i) {
      list_article = document.createElement("article");
      evol_title = document.createElement("h3");
      evol_title.innerHTML = selected_pokemon.family[i].name;
      var evol_figure = document.createElement("figure");
      evol_picture = document.createElement("img");
      evol_picture.width = "100";
      evol_picture.height = "100";
      evol_figure.appendChild(evol_picture);
      evol_figure.addEventListener("click",function(){
         pokemon_to_show = document.getElementById("pokemon_" + selected_pokemon.family[i].id)
         active_link_from_picture(selected_pokemon.family[i].name);
         hide_current_shown_pokemon();
         show(pokemon_to_show);
      });
      evol_picture.src = selected_pokemon.family[i].picture;
      evol_picture.alt = selected_pokemon.family[i].name;
      evol_picture.width = "100";
      evol_ul = document.createElement("ul");
      evol_id = document.createElement("li");
      evol_id.innerHTML = "<span> N°: </span>" + selected_pokemon.family[i].id;
      evol_type = document.createElement("li");
      evol_type.innerHTML = "<span> Type: </span>" + type_translate(selected_pokemon.family[i].type);
      evol_ul.appendChild(evol_id);
      evol_ul.appendChild(evol_type);

      list_article.appendChild(evol_title);
      list_article.appendChild(evol_figure);
      list_article.appendChild(evol_ul);

      aside.appendChild(list_article)
    }(i));
  }

  content.appendChild(article);
  content.appendChild(aside);
  page_body.appendChild(content);
  div_principale.appendChild(page_body);
  document.getElementById('pokemon-show').appendChild(div_principale);
}

function hide(element){
    element.classList.add('to-hide');
    if(element.classList.contains('to-show')){
       element.classList.remove('to-show');
    }
}

function hide_current_shown_pokemon(){
  var current_pokemon_to_hide = document.getElementById("pokemon-show").getElementsByClassName("to-show")[0];
  if(current_pokemon_to_hide){
    hide(document.getElementById("pokemon-show").getElementsByClassName("to-show")[0]);
  }
}

function show(element){
  element.classList.add('to-show');
  if(element.classList.contains('to-hide')){
     element.classList.remove('to-hide');
  }
}

var parameters;
// ONLOAD
window.addEventListener("load", function() {
  parseJson();
  pokedex_link();
  on_submit();
});

var errors = [];
var QUERY_SIGNS = ["=", "<=", ">=", "<", ">"];
var OR_AND_SIGN = ["&", "||"];
var POKEMON_ATTRIBUTES_FOR_RESEARCH = ["id", "name", "type", "gender", "weight", "height", "special_capacity_name"]
