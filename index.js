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
    var pokemon_to_create = new Pokemon(attributes.id, attributes.name, attributes.type, attributes.picture, attributes.href, attributes.description);
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
      cell.addEventListener("click",function(){
         window.open("show.html?pokemon=" + pokemon.name);
      });

    default:
      break;
  }
}

// MENU
function set_pokemon_menu(data_pokemons){
  menu = document.getElementById("menu-pokemons");
  var list = document.createElement("ul");
  for(pokemon in data_pokemons){
    attributes = data_pokemons[pokemon];
    var pokemon_to_list = new Pokemon(attributes.id, attributes.name, attributes.type, attributes.picture, attributes.href, attributes.description);
    list_element = document.createElement("li");
    list_element.className = "menuElement";
    link = document.createElement("a");
    link.href = pokemon_to_list.href;
    link.innerHTML = pokemon_to_list.name;
    list_element.appendChild(link);
    list.appendChild(list_element);
  }
  menu.appendChild(list);
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

// ONLOAD
window.addEventListener("load", function() {
  parseJson();
});
