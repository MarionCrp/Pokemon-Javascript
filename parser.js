// ex : type = eau & height > 2
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

MultipleCondition.prototype.is_valid = function(){
  return (this.conditions.length == 2 && this.conditions[0].is_valid()
                                      && this.conditions[1].is_valid()
                                      && (this.operator == "&" || this.operator =="||"));
}

// ex : type = Eau
// ex : height > 2
function Condition(string) {
  elements = clean(string.split(" "));

  this.key = attribute_translate(elements[0]); // L'utilisateur doit faire sa requête en français. Mais on l'enregistre en anglais.
  this.operator = elements[1];
  this.value = elements[2];
}

Condition.prototype.is_valid = function(){
  if(["id", "name", "type", "special_capacity_name"].includes(this.key)){
    return this.operator == "=";
  } else if (["height", "weight"].includes(this.key)){
    return (["=", "<", "<=", ">", ">="].includes(this.operator))
  } else {
    return false;
  }
}

Condition.prototype.is_numeric = function(){
  return this.key == "height" || this.key == "weight";
}

function PokemonRow(row){
  cells = row.children;
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
      var condition_value = Number(condition.value);
      concerned_cell_content = Number(concerned_cell_content);
      switch (condition.operator) {
        case "=":
          return concerned_cell_content == condition_value;
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
      return this[condition.key + "_content"].includes(condition.value);
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


 // .filter(n => n) remove empty string from the array
function clean(array){
   return array.filter(n => n);
}

// FONCTION PRINCIPALE APPELEE LORS DU FILTRE
// ex: type = eau & height < 2
function parse_and_search_requested_string(requested_string, pokemon_rows){
  // On réaffiche les pokemons et on préfiltre si le type est selectionné dans le select.
  for(i = 0; i < pokemon_rows.length; i++){
    // On réinitialise le tableau, en réaffichant les éléments au départ, à chaque recherche
    var pokemon_row = new PokemonRow(pokemon_rows[i]);
    pokemon_row.show();
    if(parameters["type"] != "all") {
      if(pokemon_row.type_content.toLowerCase() != parameters["type"].toLowerCase()){
        pokemon_row.hide();
      }
    }
  }

  if(requested_string != "") {
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
