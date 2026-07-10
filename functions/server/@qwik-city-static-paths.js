const staticPaths = new Set(["/_routes.json","/favicon.ico","/favicon.svg","/fonts/NotoSans-Bold.ttf","/fonts/NotoSans-Bold.woff2","/fonts/NotoSans-BoldItalic.ttf","/fonts/NotoSans-Light.ttf","/fonts/NotoSans-Light.woff2","/fonts/NotoSans-LightItalic.ttf","/fonts/NotoSans-Medium.ttf","/fonts/NotoSans-MediumItalic.ttf","/fonts/NotoSans-Regular.ttf","/fonts/NotoSans-Regular.woff2","/fonts/NotoSans-RegularItalic.ttf","/fonts/NotoSans-SemiBold.ttf","/fonts/NotoSans-SemiBold.woff2","/fonts/NotoSans-SemiBoldItalic.ttf","/fonts/NotoSerif-Bold.ttf","/fonts/NotoSerif-Bold.woff2","/fonts/NotoSerif-BoldItalic.ttf","/fonts/NotoSerif-Light.ttf","/fonts/NotoSerif-Light.woff2","/fonts/NotoSerif-LightItalic.ttf","/fonts/NotoSerif-Medium.ttf","/fonts/NotoSerif-Medium.woff2","/fonts/NotoSerif-MediumItalic.ttf","/fonts/NotoSerif-Regular.ttf","/fonts/NotoSerif-Regular.woff2","/fonts/NotoSerif-RegularItalic.ttf","/fonts/NotoSerif-SemiBold.ttf","/fonts/NotoSerif-SemiBold.woff2","/fonts/NotoSerif-SemiBoldItalic.ttf","/images/Background_EC.jpg","/images/Cancellationpolicy_(1).jpg","/images/Cancellationpolicycel.jpg","/images/Diseo_sin_ttulo_(22).png","/images/Full_Day.png","/images/Half_day_(1).png","/images/Logo_Gordo.png","/images/Logo_Gordo_(1).png","/images/Three_quarters_day.png","/images/dayicon-05.png","/images/dayicon-06.png","/images/dayicon-07.png","/images/difficulty_icons/challenging.svg","/images/difficulty_icons/easy.svg","/images/difficulty_icons/moderate.svg","/images/favicon.png","/images/flora&fauna.svg","/images/pin.png","/images/thumbnailNLA_(1)_(1).png","/images/webExperinceCollectionfinal-06.png","/images/webExperinceCollectionfinal-07.png","/images/webExperinceCollectionfinal-08.png","/images/webExperinceCollectionfinal-09.svg","/images/webExperinceCollectionfinal-10.svg","/images/webExperinceCollectionfinal-11.svg","/images/webExperinceCollectionfinal-13.svg","/images/webExperinceCollectionfinal-14.svg","/images/webExperinceCollectionfinal-15.svg","/images/webExperinceCollectionfinal-16.svg","/manifest.json","/q-manifest.json","/robots.txt","/sitemap.xml"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };