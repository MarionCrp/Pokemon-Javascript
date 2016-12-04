// DATAS
function Pokemon(id, name, type, picture, href = null, description = null, weight = null, height = null, special_capacities = [], family = []){
  this.id = id;
  this.href = href;
  this.name = name;
  this.type = type;
  this.picture = picture;
  this.description = description;
  this.weight = weight;
  this.height = height;
  nb_of_capacities = special_capacities.length;
  this.special_capacities = [];
  for(i in special_capacities){
    this.special_capacities.push(new SpecialCapacity(special_capacities[i]['title'], special_capacities[i]['description']));
  }
  this.family = [];
  for(i in family){
    this.family.push(new Pokemon(family[i].id, family[i].name, family[i].type, family[i].picture));
  }

}

function SpecialCapacity(title, description){
  this.title = title;
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

function attribute_translate(attribute){
  if(["élément", "element", "élement", "type"].includes(attribute)) return "type";
  else {
    switch (attribute) {
      case "id":
        return "id";
        break;
      case "nom":
        return "name";
        break;
      case "taille":
        return "height";
        break;
      case "poids":
        return "weight";
        break;
      default:
        errors.push("Cet attribut n'existe pas");
        return null;
        break;
    }
  }
}
