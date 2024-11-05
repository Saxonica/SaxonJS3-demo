<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="#all"
                version="3.0">

<xsl:output method="html" html-version="5" encoding="utf-8" indent="no"/>

<xsl:key name="spans" match="span" use="@id"/>

<xsl:template name="xsl:initial-template">
  <xsl:apply-templates select="ixsl:page()//span[@id='sum']"/>
</xsl:template>

<xsl:template match="span">
  <xsl:variable name="a" select="key('spans', 'a')"/>
  <xsl:variable name="b" select="key('spans', 'b')"/>
  <xsl:result-document href="?." method="ixsl:replace-content">
    <xsl:value-of select="if ($a castable as xs:integer
                              and $b castable as xs:integer)
                          then xs:integer($a) + xs:integer($b)
                          else 'ERR'"/>
  </xsl:result-document>
</xsl:template>

</xsl:stylesheet>
