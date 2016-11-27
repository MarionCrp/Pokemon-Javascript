// DATAS
function Pokemon(id, name, type, picture, href, description, gender = null, weight = null, height = null, special_capacities = []){
  this.id = id;
  this.href = href;
  this.name = name;
  this.type = type;
  this.picture = picture;
  this.description = description;
  this.gender = gender;
  this.weight = weight;
  this.height = height;
  nb_of_capacities = special_capacities.length;
  this.special_capacities = [];
  for(i in special_capacities){
    this.special_capacities.push(new SpecialCapacity(special_capacities[i]['title'], special_capacities[i]['description']));
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
