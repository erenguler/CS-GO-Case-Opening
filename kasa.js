///////////// GEREKLİ FONKSİYONLAR ////////////
Array.prototype.shuffle = function () {
	var counter = this.length,
		temp, index;
	while (counter > 0) {
		index = (Math.random() * counter--) | 0;
		temp = this[counter];
		this[counter] = this[index];
		this[index] = temp;
	}
}
Array.prototype.max = function () {
	return Math.max.apply(null, this);
};

Array.prototype.min = function () {
	return Math.min.apply(null, this);
};

function randomEx(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate({
	timing,
	draw,
	duration
}) {

	let start = performance.now();

	requestAnimationFrame(function animate(time) {
		// timeFraction goes from 0 to 1
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// calculate the current animation state
		let progress = timing(timeFraction);

		draw(progress); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}

	});
}

function KasaIcerigi(xmlDocument) // KASA İÇERİĞİ
{
	var kasalar = xmlDocument.getElementsByTagName("kasa");

	for (i = 0; i < kasalar.length; i++) {
		var kasa = kasalar[i];
		var adi = kasa.getElementsByTagName("adi");
		document.write("<h1>" + adi[0].textContent.toString() + "</h1>");

		var silahlar = kasa.getElementsByTagName("silah");
		for (var j = 0; j < silahlar.length; j++) {
			var silah = silahlar[j];
			var silahadi = silah.getElementsByTagName("adi");
			var silahdeger = silah.getElementsByTagName("deger");
			document.write(silahadi[0].textContent.toString() + "-" + silahdeger[0].textContent.toString() + "</br>");
		}
		document.write("<hr>");
	}
}


window.onload = function () {
	var Connect = new XMLHttpRequest();
	Connect.open("GET", "kasa.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var xmlDocument = Connect.responseXML;

	var siteKatsayi = 3;
	var kasaNo = 0;
	var kasalar = xmlDocument.getElementsByTagName("kasa");

	var liste = [];
	var degerler = [];

	var kasa = kasalar[kasaNo];
	var adi = kasa.getElementsByTagName("adi");
	var resmi = kasa.getElementsByTagName("resim");
	document.getElementById('kasaadi').innerHTML = adi[0].textContent.toString();
	document.getElementById('kasaresmi').src = resmi[0].textContent.toString();

	var silahlar = kasa.getElementsByTagName("silah");

	for (var j = 0; j < silahlar.length; j++) {
		var silah = silahlar[j];
		var silahdeger = silah.getElementsByTagName("deger");
		var degeri = parseInt(silahdeger[0].textContent.toString());
		degerler.push(degeri);
	}
	var altsinir = Math.min.apply(null, degerler);


	var gosterim = document.getElementById('kasa-icerigi');

	for (var j = 0; j < silahlar.length; j++) {
		var silah = silahlar[j];
		var silahadi = silah.getElementsByTagName("adi");
		var silahdeger = silah.getElementsByTagName("deger");
		var silahrenk = silah.getElementsByTagName("renk");
		var silahresim = silah.getElementsByTagName("resim");

		var adi = silahadi[0].textContent.toString();
		var degeri = parseInt(silahdeger[0].textContent.toString());
		var renk = silahrenk[0].textContent.toString();
		var resim = silahresim[0].textContent.toString();

		var sans = 100 - degeri;
		gosterim.innerHTML += "<li><div class='kapsayici'><div class='ustresim'>" +
			"<img src='" + resim + "'>" +
			"</div>" +
			"<div class='altbilgi' style='background-color:" + renk + "';>" +
			"<h3>" + adi + "</h3>" +
			"<p>Şans:" + sans + "%</p>" +
			"</div>"
		"</div></li>";

		liste.push({
			ladi: adi,
			ldegeri: degeri,
			lrenk: renk,
			lresim: resim
		});
	}

	document.getElementById('acbutonu').onclick = function () {
		Basla(liste, altsinir, siteKatsayi);
	}

}

function Basla(silahlistesi, altsinir, katsayi) {
	var rastgele = Math.floor(Math.random() * 101); // 0 - 100
	var sinir = rastgele * katsayi;

	if (sinir < altsinir) {
		sinir = altsinir;
	}

	var sinirListesi = [];

	for (var j = 0; j < silahlistesi.length; j++) {
		var degeri = silahlistesi[j].ldegeri;
		if (degeri <= sinir) {
			sinirListesi.push({
				ladi: silahlistesi[j].ladi,
				ldegeri: silahlistesi[j].ldegeri,
				lrenk: silahlistesi[j].lrenk,
				lresim: silahlistesi[j].lresim
			});
		}
	}

	var lines = [];

	// dönecek listeyi hazırlama
	for (i = 0; i < 150; i++) {
		var rast = Math.floor(Math.random() * sinirListesi.length);
		var eleman = sinirListesi[rast];
		lines.push({
			ladi: eleman.ladi,
			ldegeri: eleman.ldegeri,
			lrenk: eleman.lrenk,
			lresim: eleman.lresim
		});
	}

	var duration_time = 10000; // 10 saniye

	if (lines.length < 2) {
		alert("en az 2");
		return false;
	} else {
		var scrollsize = 0;
		diff = 0,
			insert_times = 30,
			duration_time = 11000;
		var loadout = document.getElementById('loadout');
		loadout.innerHTML = "";
		loadout.style.left = "0px";

		for (var i = 0; i < lines.length; i++) {
			loadout.innerHTML += "<td><div class='roller'><img src='" +
				lines[i].lresim + "' style='max-width:100%;background-image: url(arka.png);'><div style='background:" + lines[i].lrenk + ";color:white;'>" + lines[i].ladi + "</div></div></td>";

			scrollsize = scrollsize + 192;
		}

		animate({
			duration: duration_time,
			timing: function circ(timeFraction) {
				return 1 - Math.sin(Math.acos(timeFraction))
			},
			draw: function (progress) {
				var suan = parseInt(loadout.style.left);
				var ortasi = (scrollsize / 2) * -1;
				var arttirma = 0;
				if (suan < ortasi) {
					if (diff < 0.2 && diff > -0.2) {
						arttirma = 0;
					} else {
						arttirma = -0.3;
					}
				} else {
					arttirma = 0.2;
				}
				diff = diff + arttirma;

				var sayi = parseInt(loadout.style.left) - diff;
				loadout.style.left = sayi + 'px';
			}
		});

	}

}