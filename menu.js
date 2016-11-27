// MENU
function set_pokemon_menu(data_pokemons, pokemon_name_param = null){
  menu = document.getElementById("menu-pokemons");
  var list = document.createElement("ul");
  for(pokemon in data_pokemons){
    attributes = data_pokemons[pokemon];
    var pokemon_to_list = new Pokemon(attributes.id, attributes.name, attributes.type, attributes.picture, attributes.href, attributes.description);
    list_element = document.createElement("li");
    list_element.className = "menuElement";
    link = document.createElement("a");
    link.href = "show.html?pokemon=" + pokemon_to_list.name;
    link.innerHTML = pokemon_to_list.name;
    if(pokemon_to_list.name == pokemon_name_param){
      link.className = "active-link";
      document.getElementsByClassName("menuElement")[0].getElementsByTagName('a')[0].className="";
    }
    list_element.appendChild(link);
    list.appendChild(list_element);
  }
  menu.appendChild(list);
}
