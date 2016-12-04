// On rempli le tableau de pokemon
function set_in_index(pokemon){
  // Ligne dans laquelle nous allons afficher les informations
  var pokemon_row = document.createElement("tr");

  // Champs que l'on souhaite afficher dans l'index
  var attributes = ['id', 'type', 'picture', 'name', 'height', 'weight', 'description'];
  for(var i = 0; i < attributes.length; i++){
    var cell = document.createElement("td");
    cell.innerHTML = pokemon[attributes[i]];
    // Remplie les champs des attributs selon leur type
    set_property_row_attributes(attributes[i], cell, pokemon);
    pokemon_row.appendChild(cell);
  }
  document.getElementById("pokemon-index").getElementsByTagName("tbody")[0].appendChild(pokemon_row);
}


function set_property_row_attributes(property, cell, pokemon){
  switch (property) {
    // Dans un type on affiche le titre, et on attribut à la case une classe avec le même nom (ex: ".fire"). Le css s'occupera d'afficher en fond l'icone associée.
    case 'type':
      cell.className = pokemon.type;
      var content = cell.firstChild;
      cell.innerHTML = type_translate(cell.innerHTML); // On traduit les données de type en français
      var wrapper = document.createElement("span");
      cell.replaceChild(wrapper, content)
      wrapper.appendChild(content);
      break;

    // Ajout de l'image et de ses attributs. Mais aussi de l'évènement au clic qui renvoie vers la fiche détaillée du pokemon.
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

      // Evènement vers la fiche détaillée
      cell.addEventListener("click",function(){
        pokemon_to_show = document.getElementById("pokemon_" + pokemon.id);
        // On cache l'index, et on affiche le détail du pokemon.
        hide(document.getElementById("pokemon-index"));
        show(pokemon_to_show);
        // On met en actif le lien correspondant au pokemon affiché.
        active_link_from_picture(pokemon.name); // main.js
      });

    default:
      break;
  }
}

// On créé et rempli les fiches détaillées
function set_in_details(selected_pokemon){

  // Intégration de la description princpale
  var div_principale = document.createElement('div');
  div_principale.id = "pokemon_" + selected_pokemon.id;
  hide(div_principale);
  var title = document.createElement('h2');
  title.innerHTML = selected_pokemon.name;
  var page_body = document.createElement('div');
  page_body.className = "page-bodys";
  var content = document.createElement('div');
  content.className = "content";
  var article = document.createElement('article');
  article.className = "main-desc";

  var section = document.createElement('section');
  section.appendChild(title);

  // Intégration de l'image
  var div_image = document.createElement('div');
  var image = document.createElement('img');
  image.src =  selected_pokemon.picture;
  image.alt = selected_pokemon.name;
  image.width = "100";
  div_image.appendChild(image);

  // Intégration de la description
  var div_description = document.createElement('div');
  div_description.className = "description";
  var description_label = document.createElement('h3');
  description_label.innerHTML = "Description";
  var description_content = document.createElement('p');
  description_content.innerHTML = selected_pokemon.description;
  div_description.appendChild(description_label);
  div_description.appendChild(description_content);
  section.appendChild(div_image);
  section.appendChild(div_description);
  article.appendChild(section);

  // Intégration des caractéristiques :
  var section_carac = document.createElement('section')
  section_carac.className = "caracteristics";
  var title_carac = document.createElement('h3');
  title_carac.innerHTML = "Caractéristiques";
  var ul_carac = document.createElement('ul');
  var item_id = document.createElement('li');
  item_id.innerHTML = "<spans>N°: </spans>" + selected_pokemon.id;
  var item_type = document.createElement('li');
  item_type.innerHTML = "<spans>Type: </spans>" + type_translate(selected_pokemon.type);
  var item_height = document.createElement('li');
  item_height.innerHTML = "<spans>Taille: </spans>" + selected_pokemon.height;
  var item_weight = document.createElement('li');
  item_weight.innerHTML = "<spans>Poids: </spans>" + selected_pokemon.weight;

  for(i in item_attributes = [item_id, item_type, item_height, item_weight]){
    ul_carac.appendChild(item_attributes[i]);
  }

  section_carac.appendChild(title_carac);
  section_carac.appendChild(ul_carac);
  article.appendChild(section_carac);

  // Intégration des capacités spéciales
  var section_spec_capacities = document.createElement('section');
  section_spec_capacities.className = "special_capacities";
  var title_capacity = document.createElement('h3');
  title_capacity.innerHTML = "Capacités Spéciales";
  var ul_capacities = document.createElement('ul');

  var special_capacities = selected_pokemon.special_capacities
  for(i in special_capacities) {
    var item = document.createElement('li')
    item.innerHTML = ('<span>' + special_capacities[i]['title'] + ' : </span>' + [special_capacities[i]['description']]);
    ul_capacities.appendChild(item);
    ul_capacities.appendChild(document.createElement('br'));
  }

  section_spec_capacities.appendChild(title_capacity);
  section_spec_capacities.appendChild(ul_capacities);
  article.appendChild(section_spec_capacities);

  // Intégration du aside
  var aside = document.createElement('aside');
  var title_evol = document.createElement('h3');
  aside.appendChild(title_evol)

  // Si le pokemon n'a pas d'évolution on le notifie, sinon on affiche la liste de ses évolutions
  if(selected_pokemon.family.length == 0){
    title_evol.innerHTML = "Les évolutions de ce pokemon ne sont pour l'instant pas disponible";
  } else {
    if(selected_pokemon.family.length > 1){
      title_evol.innerHTML = "Evolutions";
    } else {
      title_evol.innerHTML = "Evolution";
    }

    // Pour chaque évolution :
    for(i in selected_pokemon.family){ (function(i) {
        var list_article = document.createElement("article");
        var evol_title = document.createElement("h3");
        evol_title.innerHTML = selected_pokemon.family[i].name;
        var evol_figure = document.createElement("figure");
        var evol_picture = document.createElement("img");
        evol_picture.width = "100";
        evol_picture.height = "100";
        evol_figure.appendChild(evol_picture);

        // Lors du clique sur l'image d'une évolution, cela renvoie vers sa fiche détaillée
        evol_figure.addEventListener("click",function(){
           var pokemon_to_show = document.getElementById("pokemon_" + selected_pokemon.family[i].id)
           active_link_from_picture(selected_pokemon.family[i].name); // menu.js
           hide_current_shown_pokemon();
           show(pokemon_to_show);
        });
        evol_picture.src = selected_pokemon.family[i].picture;
        evol_picture.alt = selected_pokemon.family[i].name;
        evol_picture.width = "100";
        var evol_ul = document.createElement("ul");
        var evol_id = document.createElement("li");
        evol_id.innerHTML = "<span> N°: </span>" + selected_pokemon.family[i].id;
        var evol_type = document.createElement("li");
        evol_type.innerHTML = "<span> Type: </span>" + type_translate(selected_pokemon.family[i].type);
        evol_ul.appendChild(evol_id);
        evol_ul.appendChild(evol_type);

        list_article.appendChild(evol_title);
        list_article.appendChild(evol_figure);
        list_article.appendChild(evol_ul);
        aside.appendChild(list_article)
      }(i));
    }
  }

  // Intégration de la fiche de détail à la page
  content.appendChild(article);
  content.appendChild(aside);
  page_body.appendChild(content);
  div_principale.appendChild(page_body);
  document.getElementById('pokemon_details').appendChild(div_principale);
}


/// NAVIGATION :

// MENU
// Ajout des liens vers les pokemons dans le menu.
function set_menu_element(pokemon_to_list){
  // On créé dynamiquement les liens vers les pokemons
  var list = document.getElementById('menu-pokemons').getElementsByTagName('ul')[0];
  var list_element = document.createElement("li");
  list_element.className = "menuElement";
  var link = document.createElement("a");
  link.href = "#";

  // Au clic d'un lien, on cache tous les éventuelles fiches pokemon ou index pour rafficher juste la fiche détail du pokemon sélectionné.
  link.addEventListener("click", function(){
    var index = document.getElementById('pokemon-index');
    hide(index);
    hide_all_show_pokemon(); // menu.js
    active_link(this); // menu.js

    var pokemon_to_show = document.getElementById('pokemon_' + pokemon_to_list.id);
    show(pokemon_to_show);
  });

  link.innerHTML = pokemon_to_list.name;

  list_element.appendChild(link);
  list.appendChild(list_element);
}


// FORMULAIRE DE RECHERCHE
// Génère les options du "select" "type"
function set_option_elements(types){
  var select = document.getElementsByTagName('select').type;
  for(i in types){
    var option = document.createElement('option')
    option.value = type_translate(types[i]);
    option.innerHTML = type_translate(types[i]);
    select.appendChild(option);
  }
}
