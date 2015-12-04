function KMToLY( kilometers ){
	return kilometers * 1.05702341 * Math.pow(10,-4);
}

function LYToKM( LY ) {
	return LY / 1.05702341 * Math.pow(10,-13);
}

function AUToLY( AU ){
	return AU * 1.58128451 * Math.pow(10,-5);
}

Math.TWO_PI = Math.PI * 2.0;

//	from
//	Ryan Scranton
//	http://code.google.com/p/astro-stomp/source/browse/trunk/stomp/stomp_angular_coordinate.cc#688
function EquatorialToGalactic( ra, dec ){
	var g_psi = 0.57477043300;
	var sTheta = 0.88998808748;
	var ctheta = 0.45598377618;
	var g_phi = 4.9368292465;

	var a = ra - g_phi;
	// var b = dec;

	var sb = Math.sin( dec );
	var cb = Math.cos( dec );
	var cbsa = cb * Math.sin( a );

	var b = -1.0 * sTheta * cbsa + ctheta * sb;
	if( b > 1.0 )
		b = 1.0;

	var bo = Math.asin( b );

	a = Math.atan2( ctheta * cbsa + sTheta * sb, cb * Math.cos(a) );
	var ao = (a + g_psi + 4.0 * Math.PI );

	while( ao > Math.TWO_PI )
		ao -= Math.TWO_PI;

	var gal_lon = ao;
	if( gal_lon < 0.0 )
		gal_lon += Math.TWO_PI;
	if( gal_lon > Math.TWO_PI )
		gal_lon -= Math.TWO_PI;

	var gal_lat = bo;

	return {
		lat: gal_lat,
		lon: gal_lon
	};

}