<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 	        xmlns:ixsl="http://saxonica.com/ns/interactiveXSLT"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

<xsl:output method="xml" encoding="utf-8" indent="no" omit-xml-declaration="yes"/>

<xsl:param name="a" select="1"/>
<xsl:param name="b" select="2"/>
<xsl:param name="c" select="3"/>

<xsl:variable name="numbers" select="(xs:integer($a), xs:integer($b), xs:integer($c))"/>

<xsl:template name="xsl:initial-template">
  <doc>
    <xsl:text>Using XPath to find the squares of a sequence of numbers </xsl:text>
    <xsl:value-of select="$numbers" separator=", "/>
    <xsl:text> = </xsl:text>
    <xsl:for-each select="$numbers">
      <xsl:if test="position() gt 1">, </xsl:if>
      <xsl:value-of select=". * ."/>
    </xsl:for-each>
  </doc>
</xsl:template>

</xsl:stylesheet>
