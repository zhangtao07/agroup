将常见文档转成 pdf
-----------------

## 编译

需要以下库：

    aspose-cells-8.2.1.jar         aspose-words-14.7.0.jar        bcprov-jdk16-146.jar
    aspose-email-4.5.0.0-jdk16.jar aspose.slides-14.6.0.jar       jcommander-1.30.jar

## 使用方法

    java -jar office2pdf.jar -l licence.xml -f dir input.doc output.pdf

有两个可选参数，一个是 `-l` 用于指定 aspose 的许可证（如果没有会有些限制，如只能转几页），`-f` 用于指定字体文件目录，用于增强 Mac/Linux 对中文的支持，建议找一台安装完 office 的 windows 机器，然后将 %windows%/Fonts 目录拷贝过来，指定这个目录

## 支持的格式

可以在源码中找到

