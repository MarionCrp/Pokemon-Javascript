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

  this.key = elements[0];
  this.operator = elements[1];
  this.value = elements[2];

  function is_true_for(value){
    if(is_equal_operator()){
    }
  }

  function is_equal_operator(){
    return (this.operator == "=" || this.operator == "==");
  }

  function is_more_or_operator(){
    this.operator == ">" || this.operator == ">="
  }

  function is_more_or_operator(){
    this.operator == "<" || this.operator == "<="
  }
}

Condition.prototype.is_valid = function(){
  if(["id", "name", "type", "special_capacity_name"].includes(this.key)){
    return (["=", "=="].includes(this.operator))
  } else if (["height", "weight"].includes(this.key)){
    return (["=", "==", "<", "<=", ">", ">="].includes(this.operator))
  } else {
    return false;
  }
}


 // .filter(n => n) remove empty string from the array
function clean(array){
   return array.filter(n => n);
}
