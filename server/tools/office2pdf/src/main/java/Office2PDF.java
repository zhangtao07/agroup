import java.util.ArrayList;
import java.util.Arrays;
import java.io.File;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.JCommander;

import com.aspose.cells.Workbook;
import com.aspose.slides.Presentation;
import com.aspose.words.Document;
import com.aspose.words.FontSettings;
import com.aspose.words.FolderFontSource;
import com.aspose.words.FontSourceBase;
import com.aspose.email.MailMessage;
import com.aspose.email.MessageFormat;
import com.aspose.email.MailMessageSaveType;

class Office2PDF {
  @Parameter
  public ArrayList<String> files = new ArrayList<String>();

  @Parameter(names = { "-l", "-licence" }, description = "path to aspose licence")
  public String licenceFile = "";

  @Parameter(names = { "-f", "-fontdir" }, description = "path to font directory")
  public String fontDir = "";

  public static void main(String[] args) throws Exception {
    Office2PDF office2PDF = new Office2PDF();
    new JCommander(office2PDF, args);

    if (office2PDF.files.size() != 2) {
      System.out.println("Usage: java -jar office2pdf.jar input.doc output.pdf");
      return;
    }

    if (!office2PDF.licenceFile.equals("")) {
      File licenceFile = new File(office2PDF.licenceFile);
      if (!licenceFile.exists()) {
        System.out.println("Warning: licence file don't exists");
        office2PDF.licenceFile = "";
      }
    }

    if (!office2PDF.fontDir.equals("")) {
      File fontDir = new File(office2PDF.fontDir);
      if (!fontDir.exists() || !fontDir.isDirectory()) {
        System.out.println("Warning: font directory don't exists");
        office2PDF.fontDir = "";
      }
    }

    String input = office2PDF.files.get(0);
    String output = office2PDF.files.get(1);

    File inputFile = new File(input);
    if (inputFile.exists() && !inputFile.isDirectory()) {
    } else {
      System.out.println("input file should exist");
      return;
    }

    File outputFile = new File(output);
    File outputFileDir = outputFile.getAbsoluteFile().getParentFile();
    if (!outputFileDir.exists()) {
      outputFileDir.mkdirs();
    }

    String inputExt = "";
    int extIndex = input.lastIndexOf('.');
    if (extIndex > 0) {
        inputExt = input.substring(extIndex + 1).toLowerCase();
    }

    if (inputExt.equals("")) {
      System.out.println("input file should have extension");
    }

    if (inputExt.equals("xls")
      || inputExt.equals("xlsx")
      || inputExt.equals("xlsb")
      || inputExt.equals("xlsm")
      || inputExt.equals("xltx")
      || inputExt.equals("xltm")
      || inputExt.equals("csv")
      || inputExt.equals("ods")) {
      office2PDF.convertExcel(input, output);
    } else if (inputExt.equals("doc")
      || inputExt.equals("docx")
      || inputExt.equals("dot")
      || inputExt.equals("docm")
      || inputExt.equals("dotm")
      || inputExt.equals("odt")
      || inputExt.equals("ott")
      || inputExt.equals("txt")
      || inputExt.equals("rtf")
      || inputExt.equals("mht")
      || inputExt.equals("mhtml")
      || inputExt.equals("htm")
      || inputExt.equals("html")
      || inputExt.equals("xml")
      || inputExt.equals("epub")) {
      office2PDF.convertWord(input, output);
    } else if (inputExt.equals("ppt")
      || inputExt.equals("pptx")
      || inputExt.equals("pot")
      || inputExt.equals("potx")
      || inputExt.equals("pps")
      || inputExt.equals("ppsx")) {
      office2PDF.convertPowerPoint(input, output);
    } else if (inputExt.equals("msg")
      || inputExt.equals("eml")
      || inputExt.equals("emlx")) {
      office2PDF.convertEmail(input, output);
    } else {
      System.out.println("don't support this extension");
    }
  }

  private static String OS = System.getProperty("os.name").toLowerCase();

  private boolean isMac() {
    return (OS.indexOf("mac") >= 0);
  }

  private boolean isWindows() {
    return (OS.indexOf("win") >= 0);
  }

  private boolean isLinux() {
    return (OS.indexOf("nix") >= 0 || OS.indexOf("nux") >= 0 || OS.indexOf("aix") > 0);
  }

  private void convertEmail(String input, String output) throws Exception {
    if (!licenceFile.equals("")) {
      com.aspose.email.License licence = new com.aspose.email.License();
      licence.setLicense(licenceFile);
    }

    File tempFile = File.createTempFile("agroup", ".mhtml");
    tempFile.deleteOnExit();
    String tempFilePath = tempFile.getAbsolutePath();
    MailMessage msg = MailMessage.load(input, MessageFormat.getEml());
    msg.save(tempFilePath, MailMessageSaveType.getMHtmlFromat());
    convertWord(tempFilePath, output);
  }

  private void convertWord(String input, String output) throws Exception {
    if (!licenceFile.equals("")) {
      com.aspose.words.License licence = new com.aspose.words.License();
      licence.setLicense(licenceFile);
    }

    if (!fontDir.equals("")) {
        ArrayList fontSources = new ArrayList(Arrays.asList(FontSettings.getFontsSources()));
        FolderFontSource folderFontSource = new FolderFontSource(fontDir, true);
        fontSources.add(folderFontSource);
        FontSourceBase[] updatedFontSources = (FontSourceBase[])fontSources.toArray(new FontSourceBase[fontSources.size()]);
        FontSettings.setFontsSources(updatedFontSources);
    }

    Document doc = new Document(input);
    doc.save(output, com.aspose.words.SaveFormat.PDF);
  }

  private void convertExcel(String input, String output) throws Exception {
    if (!licenceFile.equals("")) {
      com.aspose.cells.License licence = new com.aspose.cells.License();
      licence.setLicense(licenceFile);
    }

    if (!fontDir.equals("")) {
        com.aspose.cells.CellsHelper.setFontDirs(new ArrayList(Arrays.asList(fontDir)));
    }

    if (isMac()) {
      com.aspose.cells.CellsHelper.setFontDirs(new ArrayList(Arrays.asList("/Library/Fonts", "~/Library/Fonts")));
    }

    Workbook workbook = new Workbook(input);

    try {
      workbook.calculateFormula();
    } catch (Exception e) {
      //do nothing
    }

    workbook.save(output, com.aspose.cells.FileFormatType.PDF);
  }

  private void convertPowerPoint(String input, String output) throws Exception {
    if (!licenceFile.equals("")) {
      com.aspose.slides.License licence = new com.aspose.slides.License();
      licence.setLicense(licenceFile);
    }
    Presentation slide = new Presentation(input);
    slide.save(output, com.aspose.slides.SaveFormat.Pdf);
  }
}
