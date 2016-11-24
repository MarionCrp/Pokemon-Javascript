function Pokemon(id, name, type, picture, href, description){
  this.id = id;
  this.href = href;
  this.name = name;
  this.type = type;
  this.picture = picture;
  this.description = description;
}

function type_translate(type){
  switch (type) {
    case 'fire':
      return 'Feu';
      break;
    case 'faery':
      return 'Fée';
      break;
    case 'water':
      return 'Eau';
      break;
    case 'normal':
      return 'Normal';
      break;
    default:
      return 'Non renseigné';
      break;
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
      cell.innerHTML = type_translate(cell.innerHTML);
      var wrapper = document.createElement("span");
      cell.replaceChild(wrapper, content)
      wrapper.appendChild(content);
      break;

    case 'picture':
      var content = cell.firstChild;
      var src = cell.innerHTML;
      var link = document.createElement("a");
      link.href = pokemon.href;
      var picture = document.createElement("img");
      picture.src = src;
      picture.alt = pokemon.name;
      picture.width = 100;
      link.appendChild(picture);
      cell.replaceChild(link, content);

    default:
      break;
  }
}

window.onload=function(){
  var req = new XMLHttpRequest();
  req.open("GET", "pokemons.json", true);
  req.onerror = function(){
    console.log("Echec de chargement du fichier pokemons.json");
  }
  req.onreadystatechange = (function(){
    if(req.readyState == 4 && (req.status == 200 || req.status == 0)){
      var Data = JSON.parse(req.responseText);
      var tab_body = document.getElementsByTagName("tbody")[0];
      for(pokemon in Data["pokemons"]){
        attributes = Data["pokemons"][pokemon];
        var pokemon_to_create = new Pokemon(attributes.id, attributes.name, attributes.type, attributes.picture, attributes.href, attributes.description);
        tab_body.appendChild(create_pokemon_row(pokemon_to_create));
      }
    } else {
      //alert("Not ready yet");
    }
  });

  req.send(null);
}
