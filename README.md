# SmartAdBlock
## SmartAdBlock project

Note to readers: Since the beginning smartadblock code was available to everyone unobfuscated and easy to read as any browser extension can be read.
But here you go, open source github enjoy!

## Update log

## 1.1.2
Both versions are now upgraded to jquery 3.0. Added counter measures to defuse a lot of popups before they are triggered (openload - kissanime and others). Added parsing options for a more subtle block detection.

## 1.1.2
Corrected dutch and russian translations (Thanks to https://github.com/dsrev).
Added custom filter choice via radio button system, added quick button to reload filters (right click icon -> reload filters)
in Firefox 1.1.2 switched to jquery 3 following reviewers request, upgrade to jquery 3 in chrome will come in 1.1.3

## 1.1.1
(only firefox) removed script injection to comply with firefox add on review requirements. In the v1.1.2 the injected scripts will be included in the package to comply with the request.

## 1.1.0
Improved the pre regex tests to decrease the average number of regex. Introduced light CSS injection for a number of high traffic websites.

## 1.0.9
Added custom filters, redesigned the popup, fixed the popup and switch in adult websites. Fixed some false positive popup block when using the popup link on high risk websites.
