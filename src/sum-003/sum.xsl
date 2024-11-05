<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:ex="https://saxonica.com/ns/example/functions"
                xmlns="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="#all"
                version="3.0">

<xsl:output method="html" html-version="5" encoding="utf-8" indent="no"/>

<xsl:template name="xsl:initial-template">
  <xsl:apply-templates select="ixsl:page()//span[@id='sum']"/>
</xsl:template>

<xsl:template match="span">
  <xsl:variable name="numbers"
                select="//span[contains-token(@class, 'operand')
                               and string(.) castable as xs:integer] ! xs:integer(.)"/>
  <xsl:result-document href="?." method="ixsl:replace-content">
    <xsl:value-of select="ex:sum-sequence($numbers)"/>
  </xsl:result-document>
</xsl:template>

</xsl:stylesheet>
