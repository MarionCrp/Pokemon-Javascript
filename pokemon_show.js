function find_pokemon_by_params(){
  pokemon_name = getParameterValue("pokemon");

  // On PARSE LE JSON ET ON BOUCLE DANS LA LISTE DE POKEMON POUR TROUVER LE BON
  var req = new XMLHttpRequest();
  req.open("GET", "pokemons.json", true);
  toto = "xx"
  req.onerror = function(){
    console.log("Echec de chargement du fichier pokemons.json");
  }
  req.onreadystatechange = (function(){
    if(req.readyState == 4 && (req.status == 200 || req.status == 0)){
      var Data = JSON.parse(req.responseText);
      for(pokemon in Data["pokemons"]){
        if(Data["pokemons"][pokemon].name == pokemon_name){
          attributes = Data["pokemons"][pokemon];
          var selected_pokemon =  new Pokemon(attributes.id,
                                              attributes.name,
                                              attributes.type,
                                              attributes.picture,
                                              attributes.href,
                                              attributes.description,
                                              attributes.gender,
                                              attributes.weight,
                                              attributes.height,
                                              attributes.special_capacities);
          break;
        }
      }
      if(selected_pokemon != null){
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
        document.getElementById("special_capacities")
      }
    }
  });
  req.send(null);
}

function getParameterValue(parameter_name) {
  var result = null,
      tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameter_name) result = decodeURIComponent(tmp[1]);
  }
  return result;
}


// ONLOAD
window.addEventListener("load", function() {
  var test = find_pokemon_by_params();
});
