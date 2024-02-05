export const pdfToString = async (filePath: string) : Promise<string> => {
  const {parsePdf} = require('easy-pdf-parser')

  return parsePdf(filePath).then((data: any) => {
    var s = ""
    try {
      data.Pages.forEach((page: any) => {
        page.Texts.forEach((text: any) => {
          s = s + decodeURIComponent(text.R[0].T) + " "
        });
      });
      return s
    } catch (err) {
      throw err
    }
  });
}

export const saveTxtFromString = (filePath: string, content: string) => {

}
