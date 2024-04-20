function verify_component(text, component) {
  const existComponent = new RegExp(
    `<${component}>["'].*?["']<\/${component}>`
  ).test(text);

  let navtext = text;
  let textComponent = navtext.match(/"([^"]*)"/)[0];
  var navarWt = textComponent.slice(1, -1);
  let txt = navarWt.replace(new RegExp(`<\/?${component}>`, "g"), "");
  var text = txt.split(", ");

  return { text, existComponent };
}

module.exports = { verify_component };
