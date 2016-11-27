function find_pokemon_by_params(){
  var pokemon_name = getParameterValue("pokemon");

  // On PARSE LE JSON ET ON BOUCLE DANS LA LISTE DE POKEMON POUR TROUVER LE BON
  var req = new XMLHttpRequest();
  req.open("GET", "pokemons.json", true);
  req.onerror = function(){
    console.log("Echec de chargement du fichier pokemons.json");
  }
  req.onreadystatechange = (function(){
    if(req.readyState == 4 && (req.status == 200 || req.status == 0)){
      var Data = JSON.parse(req.responseText);
      set_pokemon_menu(Data["pokemons"], pokemon_name);
      for(pokemon in Data["pokemons"]){
        if(Data["pokemons"][pokemon].name == pokemon_name){
          var attributes = Data["pokemons"][pokemon];
          // On loop dans la liste de pokemon pour trouver ses éventuelles évolutions et les assigner.
          var evolutions = [];
          var family_size = attributes.family.length;
          var evol_found = 0;
          for(i in Data["pokemons"]){
            // On compare l'id du pokemon de la liste avec les id des évolutions du pokemon selectionné.
            for(j in attributes.family){
              if(Data["pokemons"][i].id == attributes.family[j]){
                evol_attributes = Data["pokemons"][i];
                evolutions.push(new Pokemon(evol_attributes.id,
                                            evol_attributes.name,
                                            evol_attributes.type,
                                            evol_attributes.picture));
              evol_found += 1;
              }
            }
          //  if( family_size == evol_found ) break;
          }
          var selected_pokemon =  new Pokemon(attributes.id,
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
          break;
        }
      }
      if(selected_pokemon != null){

        // Intégration du titre
        document.getElementsByTagName('h1')[0].innerHTML = selected_pokemon.name;

        // Intégration de l'image
        picture = document.getElementsByClassName('main-desc')[0].getElementsByTagName('img')[0]
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

          document.getElementsByTagName('aside')[0].appendChild(list_article)
        }
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
