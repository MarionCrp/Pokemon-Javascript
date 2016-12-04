// FONCTIONS RELATIVES AUX FILTRES
// Lors du clic sur le bouton "Chercher"
function on_filter_submit(){
  // On vide notre tableau d'erreur au cas où il en contiendrait.
  errors = [];
  // On cache la fiche détaillée du pokemon s'il y en avait une
  hide_current_shown_pokemon(); // main.js
  // On réaffiche le pokedex
  show(document.getElementById("pokemon-index"));

  // On récupère les paramètres entré par l'utilisateur (dans le select ou l'input text)
  parameters = get_parameters();

  // On filtre les pokemon en fonction des paramètres
  filter(parameters);

  // En cas d'erreur, on affiche la première erreur rencontrée.
  if(errors.length > 0) alert(errors[0]);
}


// Lors du clic sur le bouton réinitialiser
function on_reinitialize(){
  document.querySelector('select').options[0].selected = true;
  document.querySelector('input');
  document.getElementsByName('word')[0].value = "";
  show_all_pokemon_in_pokedex();
}


// On récupère les paramètres de recherche de l'utilisateur
function get_parameters(){
  // Nos paramètres sont stoqué dans un tableau associatif :   ex :  type => "water"
  var values = {};
  // GET PARAMS FROM SELECT
  select_fields = document.getElementsByTagName('select');

  //Ici nous n'avons qu'un select, mais ceci est une boucle générique au cas où nous aurions d'autres select.
  for(i = 0; i < select_fields.length; i++){
    var selected_option = select_fields[i].options[select_fields[i].selectedIndex].value;
    values[select_fields[i].name] = selected_option;
  }

  // C'est la string que nous allons parser pour filter selon les conditions demandées par l'utilisateur.
  values['words'] = document.getElementsByName('word')[0].value;
  return values;
}

function filter(parameters){
  var requested_string = parameters['words'];

  // On sélectionne les lignes du tableau correspondant aux pokemon
  var rows = document.getElementById('pokedex').querySelectorAll("#pokemon-index tr:not(.main_line)");
  parse_and_search_requested_string(requested_string, rows);
}

// FONCTION PRINCIPALE APPELEE LORS DU FILTRE
// ex: type = eau & height < 2
function parse_and_search_requested_string(requested_string, pokemon_rows){
  // On réaffiche les pokemons et on préfiltre si le type est selectionné dans le select.
  for(i = 0; i < pokemon_rows.length; i++){
    // On réinitialise le tableau, en réaffichant les éléments au départ, à chaque recherche
    var pokemon_row = new PokemonRow(pokemon_rows[i]);
    pokemon_row.show();
    // Si un type en particulier à été selectionné, on ne selectionne que les pokemons correspondant au critère.
    if(parameters["type"] != "all") {
      if(pokemon_row.type_content.toLowerCase() != parameters["type"].toLowerCase()){
        pokemon_row.hide();
      }
    }
  }

  //On traite la string que si elle n'est pas vide
  if(requested_string != "") {
    // Si il n'y a qu'un seul mot, on va le rechercher dans le pokedex et afficher seulement les pokemon concernés.
    if(clean(requested_string.split(" ")).length == 1){
      for(i = 0; i < pokemon_rows.length; i++){
        var row = new PokemonRow(pokemon_rows[i]);
        if(!row.contains_string(requested_string)){
          row.hide();
        }
      }
    }
    else {
      // Si c'est une condition multiple :
      if(new MultipleCondition(requested_string).is_valid()){
        for(var i = 0; i < pokemon_rows.length; i++){
          var row = new PokemonRow(pokemon_rows[i]);
          var multi_conditions = new MultipleCondition(requested_string);
          if(multi_conditions.operator == "&"){
            for(var j = 0; j < multi_conditions.conditions.length; j++){
              if(!row.valid_the_condition(multi_conditions.conditions[j])){
                row.hide();
                break;
              }
            }
          }
          else if (multi_conditions.operator == "||"){
            var is_valid = false;
            for(var j = 0; j < multi_conditions.conditions.length; j++){
              if(row.valid_the_condition(multi_conditions.conditions[j])){
                is_valid = true;
                break;
              }
            }
            if(is_valid == false){
              row.hide();
            }
          }
        }
      }
      // Si c'est une condition simple :
      else if(new Condition(requested_string).is_valid()){
        for(i = 0; i < pokemon_rows.length; i++){
          var row = new PokemonRow(pokemon_rows[i]);
          var condition = new Condition(requested_string);
            if(!row.valid_the_condition(condition)){
              row.hide();
            }
          }
      } else {
        errors.push("La requête demandée n'est pas valide. Ex: 'height < 2' ou 'type = eau || weight < 0.5'");
        return null;
      }
    }
  }
}

 // .filter(n => n) Supprime les valeurs vide du tableau
function clean(array){
   return array.filter(n => n);
}

// FONCTIONS OBJETS RELATIVES AUX CONDTIONS
//(Multicondition = 2 conditions max    ex : type = eau & height > 2 )
// string est la valeur de l'input text envoyé par l'utilisateur
// Variable d'instance :
// operator : & ou || pour séparer les conditions.
// conditions : de type Condition
function MultipleCondition(strings) {
  this.conditions = [];
  var string_conditions = [];

  if(strings.includes("&")){
    this.operator = "&";
    string_conditions = clean(strings.split("&"));
  } else if(strings.includes("||")){
    this.operator = "||";
    string_conditions = clean(strings.split("||"));
  } else {
    return null;
  }
  for(i in string_conditions){
    this.conditions.push(new Condition(string_conditions[i]));
  }
}

// Un objet MultipleCondition est valide si ses conditions sont valides et si les opérateurs sont valides.
MultipleCondition.prototype.is_valid = function(){
  return (this.conditions.length == 2 && this.conditions[0].is_valid()
                                      && this.conditions[1].is_valid()
                                      && (this.operator == "&" || this.operator =="||"));
}

// ex : type = Eau
// ex : height > 2
// Variables d'instance:
// key : attribut pokemon que l'on veut filtrer
// operator : =, >=, <=, <, >, !=, NOT
// value : la valeur qui doit correspondre en partie à l'attribut du pokemon.
function Condition(string) {
  var elements = clean(string.split(" "));

  this.key = attribute_translate(elements[0]); // L'utilisateur doit faire sa requête en français. Mais on l'enregistre en anglais.
  this.operator = elements[1];
  this.value = elements[2];
}

// Une condition est valide si les attributs de recherche correpondent à l'id, le nom, l'élément, la taille ou le poids du pokemon.
// On doit aussi valider les recherches sensées :  ex   "nom > Togepi" n'est pas une condition valide.
Condition.prototype.is_valid = function(){
  if(["id", "name", "type"].includes(this.key)){
    if(this.key == "type" && parameters["type"] != "all"){
      errors.push("Vous ne pouvez pas sélectionner un élément en particulier et faire une recherche par élément dans la zone de texte.");
      return false;
    }
    return (["=", "NOT", "!="].includes(this.operator));
  } else if (["height", "weight"].includes(this.key)){
    return (["=", "<", "<=", ">", ">=", ""].includes(this.operator))
  } else {
    return false;
  }
}

// Pour savoir si une condition correspond à une valeur numéric attendue.
Condition.prototype.is_numeric = function(){
  return this.key == "height" || this.key == "weight";
}

// On créé un objet PokemonRow à partir d'une ligne du pokedex.
function PokemonRow(row){
  var cells = row.children;
  this.entire_row = row;
  this.entire_row_content = row.textContent.toLowerCase();
  this.id_content = cells[0].textContent.toLowerCase();
  this.type_content = cells[1].textContent.toLowerCase();
  this.name_content = cells[3].textContent.toLowerCase();
  this.height_content = cells[4].textContent.toLowerCase();
  this.weight_content = cells[5].textContent.toLowerCase();
  this.desc_content = cells[6].textContent.toLowerCase();
}

// Retourne true ou false, si la ligne rempli la condition.
PokemonRow.prototype.valid_the_condition = function(condition){
  var concerned_cell_content = this[condition.key + "_content"];
  if(condition.is_valid){
    if(condition.is_numeric()){
      // Nécessité de caster les string en nombre pour pouvoir les comparer
      var condition_value = Number(condition.value);
      concerned_cell_content = Number(concerned_cell_content);
      switch (condition.operator) {
        case "=":
          return concerned_cell_content == condition_value;
          break;
        case "NOT":
          return !(concerned_cell_content == condition_value);
          break;
        case "<":
          return concerned_cell_content < condition_value;
          break;
        case ">":
          return concerned_cell_content > condition_value;
          break;
        case "<=":
          return concerned_cell_content <= condition_value;
          break;
        case ">=":
          return concerned_cell_content >= condition_value;
          break;

        default:
          errors.push("L'opérateur n'est pas valide!");
          return null;
      }
    } else {
      // Pour les requêtes de string on va chercher les valeurs = ou non égal à .
      if(condition.operator == "="){
        return this[condition.key + "_content"].includes(condition.value);
      } else if(condition.operator == "NOT" || condition.operator == "!="){
        return !(this[condition.key + "_content"].includes(condition.value));
      }
    }
  } else {
      errors.push("Erreur ! La condition n'est pas valide!");
      return null;
  }
}

PokemonRow.prototype.contains_string = function(string){
  return this.entire_row_content.includes(string.toLowerCase());
}

PokemonRow.prototype.hide = function(){
  hide(this.entire_row);
}

PokemonRow.prototype.show = function(){
  show(this.entire_row);
}
