console.log('Generating...')
var fs = require('fs')
var Hjson = require('hjson')

function genStringResource() {
  try {
    const data = fs.readFileSync('./app/i18n/locales/vi.ts', 'utf8')
    const json = Hjson.parse(
      data.replace('export default', '').replace(';', '')
    )
    const stringName = Object.keys(json)
    fs.writeFileSync(
      './app/assets/strings.ts',
      `import I18n from '@app/i18n/i18n';
function strings(){
    return{${stringName.map((string, index) => {
      var path = ''
      if (typeof json[string] === 'string') {
        path = `
        ${string}: I18n.t("${string}", { defaultValue: "" })`
      } else {
        var keys = Object.keys(json[string])
        keys.map(val => {
          path += `
          ${string}_${val}: I18n.t("${string}.${val}",{ defaultValue: "" }),`
        })
      }
      return path
    })}
}}
export default strings
        `
    )
    console.log(
      `============== Linked ${stringName.length} string ==============`
    )
  } catch (err) {
    console.error(err)
  }
}

function genImageResource() {
  fs.readdir('./app/assets/images/', function (err, fileName) {
    if (err) {
      console.log(err)
      return
    }
    fs.writeFileSync(
      './app/assets/imagesAsset.ts',
      `const images = {
    ${fileName.map(iconNane => {
      path = `
    ${iconNane.replace('.png', '')}: require("./images/${iconNane}")`
      return path
    })}
    }
export default images`,
      { encoding: 'utf8', flag: 'w' }
    )
    console.log(
      `============== Linked ${fileName.length} images ==============`
    )
  })
}

// genStr = () => {
//   try {
//     const data = fs.readFileSync("./app/i18n/locales/vi.js", "utf8");
//     const json = Hjson.parse(
//       data.replace("export default", "").replace(";", "")
//     );
//     const stringName = Object.keys(json);
//     fs.writeFileSync(
//       "./app/assets/str.js",
//       `import i18 from '@i18';
// const strLang = {${stringName.map(string => {
//         path = `
//         ${string}: "${string}"`;
//         return path;
//       })}
// }
// export default strLang
//         `
//     );
//     console.log(
//       `============== Linked ${stringName.length} str ==============`
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };

genImageResource()
genStringResource()
// genStr();
