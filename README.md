## A map of Massachusetts SMART program rates by region

We have at least two sources of data that we will use in generating a choropleth map of Massachusetts that visualizes the difference in SMART incentive values throughout the commonwealth.

- Geographic entities: [_Massachusetts Electricity Providers by Town_](http://maps-massgis.opendata.arcgis.com/datasets/1710ebf6cf614b5fa97c0a269cece375_0) (in Shapefile format)

- Incentive rates: [_SMART Program Guidelines_](https://www.mass.gov/info-details/solar-massachusetts-renewable-target-smart-program#smart-program-guidelines-) (in Excel format)

If we want to get really fancy, we can add a shaded relief bitmap image as a base layer. References:

- http://bl.ocks.org/mjhoy/5301594

- https://bl.ocks.org/ThomasThoren/550b2ce8b1e2470e75b2

The [last time](https://github.com/ptrfrncsmrph/mass-map) I tried this, the resulting image revealed an issue with the SRTM data, so I decided if I were to attempt it again, I'd use the more granular dataset that is available for US only. I also figured I could use Python3 Another headache I ran into was conflicting Python environments and GDAL distributions, so maybe it would be nice to have the whole environment in a Docker container to have a reliably reproducible process. This will require learning Docker. All in all, this sounds like it could be a yak-shaving mission.

- 30m tiles (http://dwtkns.com/srtm30m/)

These have to be downloaded manually:

- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N41W070.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N41W071.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N41W072.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N42W071.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N42W072.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N42W073.SRTMGL1.hgt.zip
- http://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N42W074.SRTMGL1.hgt.zip
