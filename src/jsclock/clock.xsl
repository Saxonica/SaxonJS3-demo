<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:f="https://www.saxonica.com/ns/functions"
                xmlns="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="#all"
                version="3.0">

<xsl:output method="html" html-version="5" encoding="utf-8" indent="no"/>

<xsl:template name="xsl:initial-template">
  <!-- Don't need to do anything -->
</xsl:template>

<xsl:function name="f:clock" ixsl:updating="true">
  <xsl:param name="time" as="xs:dateTime"/>
  <xsl:apply-templates select="ixsl:page()//span[@id = 'now']">
    <xsl:with-param name="time" select="$time"/>
  </xsl:apply-templates>
</xsl:function>

<xsl:template match="span">
  <xsl:param name="time" as="xs:dateTime"/>

  <xsl:result-document href="?." method="ixsl:replace-content">
    <xsl:value-of select="format-dateTime($time, '[h01]:[m01]:[s01][P]')"/>
  </xsl:result-document>
</xsl:template>

</xsl:stylesheet>
