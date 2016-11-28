// INDEX PRESENTATION
function set_pokemon_nb(pokemons){
    pokemon_nb = pokemons.length;
    document.getElementById("pokemon_nb").innerHTML = pokemon_nb;
}

// INDEX POKEDEX
function set_pokedex(data_pokemons){
  var tab_body = document.getElementsByTagName("tbody")[0];
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
  }
}

function create_pokemon_row(pokemon){
  var pokemon_row = document.createElement("tr");
  var attributes = ['id', 'type', 'picture', 'name', 'description'];
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
         document.getElementById("pokemon-index").style.display = "none";
         set_show(pokemon);
         document.getElementById("pokemon-show").style.dispaly = "visible";
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
      set_pokemon_menu(Data["pokemons"]);
      set_pokedex(Data["pokemons"]);
    } else {
      //alert("Not ready yet");
    }
  });
  req.send(null);
}

function set_show(selected_pokemon){
  // Intégration du titre
  document.getElementsByTagName('h1')[0].innerHTML = selected_pokemon.name;

  // Intégration de l'image
  picture = document.getElementsByClassName('main-desc')[0].getElementsByTagName('img')[0];
  picture.src = "pictures/" + selected_pokemon.name + ".png";
  picture.alt = selected_pokemon.name;
  // Intégration des caractéristiques :
  document.getElementsByClassName('description')[0].getElementsByTagName('p')[0].innerHTML = selected_pokemon.description;
  list_items = document.getElementById('caracteristics').getElementsByTagName('li');
  attributes = ['id', 'type', 'gender', 'height', 'weight'];
  list_items[0].innerHTML += selected_pokemon['id'];
  list_items[1].innerHTML += type_translate(selected_pokemon['type']);
  list_items[2].innerHTML += selected_pokemon['gender'];
  list_items[3].innerHTML += selected_pokemon['height'] + 'm';
  list_items[4].innerHTML += selected_pokemon['weight'] + 'kg';

  // Intégration des capactités spéciales :
  capacities = selected_pokemon.special_capacities
  list = document.getElementById('special_capacities').getElementsByTagName('ul')[0];
  for(i in capacities){
    item = document.createElement('li')
    item.innerHTML = ('<span>' + capacities[i]['title'] + '</span>' + [capacities[i]['description']]);
    list.appendChild(item);
    list.appendChild(document.createElement('br'));
  }

  // Intégration des évolutions
  for(i in selected_pokemon.family){
    list_article = document.createElement("article");
    evol_title = document.createElement("h3");
    evol_title.innerHTML = selected_pokemon.family[i].name;
    evol_figure = document.createElement("figure");
    evol_picture = document.createElement("img");
    evol_figure.appendChild(evol_picture);
    evol_figure.addEventListener("click",function(){
       window.open("show.html?pokemon=" + selected_pokemon.family[i].name);
    });
    evol_picture.src = "pictures/" + selected_pokemon.family[i].name + '.png';
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

    document.getElementsByTagName('aside')[0].appendChild(list_article);
  }
}

// ONLOAD
window.addEventListener("load", function() {
  parseJson();
});
