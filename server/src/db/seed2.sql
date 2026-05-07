-- Seed data #2 for user_id: d105c232-e87c-4a8b-8154-d4b716666909
-- 30 cars, 30 customers, 30 interests

BEGIN;

-- =========================
-- 30 ARAÇ
-- =========================
INSERT INTO cars (id, user_id, title, brand, model, year, mileage, price, status, description, fuel_type, transmission, body_type, engine_power, engine_volume, drive_type, color) VALUES
('a1000001-0000-0000-0000-000000000031', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Porsche Macan S', 'Porsche', 'Macan S', 2022, 18000, 3800000, 'in_stock', 'S paket, panoramik tavan, BOSE ses sistemi, PASM süspansiyon.', 'gasoline', 'automatic', 'suv', 380, 2894, 'awd', 'Carmine Red'),
('a1000001-0000-0000-0000-000000000032', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Land Rover Defender 110', 'Land Rover', 'Defender 110', 2021, 32000, 4200000, 'reserved', 'HSE paket, Meridian ses, off-road paketi, sürüş asistanı.', 'diesel', 'automatic', 'suv', 300, 2996, '4wd', 'Santorini Black'),
('a1000001-0000-0000-0000-000000000033', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 BMW M3 Competition', 'BMW', 'M3 Competition', 2023, 8000, 5500000, 'in_stock', 'M xDrive, karbon koltuklar, M Carbon fren sistemi.', 'gasoline', 'automatic', 'sedan', 510, 2993, 'awd', 'Isle of Man Green'),
('a1000001-0000-0000-0000-000000000034', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Mercedes GLE 350d', 'Mercedes', 'GLE 350d', 2020, 48000, 2800000, 'sold', 'AMG Line, Burmester ses, aktif direksiyon, 7 kişilik.', 'diesel', 'automatic', 'suv', 272, 2925, '4wd', 'Polar White'),
('a1000001-0000-0000-0000-000000000035', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Audi RS6 Avant', 'Audi', 'RS6 Avant', 2022, 22000, 6200000, 'in_stock', '600hp twin turbo, adaptif hava süspansiyon, RS Design paket.', 'gasoline', 'automatic', 'station_wagon', 600, 3996, 'awd', 'Nardo Grey'),
('a1000001-0000-0000-0000-000000000036', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Honda HR-V Elegance', 'Honda', 'HR-V', 2021, 28000, 780000, 'in_stock', 'Elegance, 1.5 VTEC, geri görüş kamera, Honda Sensing.', 'gasoline', 'automatic', 'suv', 131, 1498, 'fwd', 'Lunar Silver'),
('a1000001-0000-0000-0000-000000000037', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Hyundai Ioniq 6 AWD', 'Hyundai', 'Ioniq 6', 2023, 12000, 2100000, 'in_stock', '77.4kWh, çift motor, 583km menzil, ultra hızlı şarj.', 'electric', 'automatic', 'sedan', 325, NULL, 'awd', 'Gravity Gold'),
('a1000001-0000-0000-0000-000000000038', 'd105c232-e87c-4a8b-8154-d4b716666909', '2019 Volkswagen Passat 2.0 TDI', 'Volkswagen', 'Passat', 2019, 72000, 890000, 'sold', 'Elegance, DSG, Navi, LED Matrix farlar.', 'diesel', 'automatic', 'sedan', 190, 1968, 'fwd', 'Deep Black'),
('a1000001-0000-0000-0000-000000000039', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Kia EV6 GT-Line', 'Kia', 'EV6', 2022, 19000, 1850000, 'reserved', 'GT-Line, 77.4kWh, 528km menzil, augmented reality HUD.', 'electric', 'automatic', 'suv', 229, NULL, 'rwd', 'Runway Red'),
('a1000001-0000-0000-0000-000000000040', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Toyota Land Cruiser 200', 'Toyota', 'Land Cruiser', 2020, 55000, 4500000, 'in_stock', 'Executive, 4.5 V8 dizel, çoklu arazi modu, klima.', 'diesel', 'automatic', 'suv', 272, 4461, '4wd', 'Super White'),
('a1000001-0000-0000-0000-000000000041', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Mini Cooper S Cabrio', 'Mini', 'Cooper S Cabrio', 2023, 7000, 1950000, 'in_stock', 'John Cooper Works paket, elektrikli soft-top, 18" jant.', 'gasoline', 'manual', 'hatchback', 192, 1998, 'fwd', 'British Racing Green'),
('a1000001-0000-0000-0000-000000000042', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Renault Clio 1.3 TCe', 'Renault', 'Clio', 2021, 35000, 540000, 'sold', 'Iconic paket, 7" dokunmatik, otomatik park, şerit asistanı.', 'gasoline', 'automatic', 'hatchback', 131, 1333, 'fwd', 'Flame Red'),
('a1000001-0000-0000-0000-000000000043', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Skoda Karoq Scout', 'Skoda', 'Karoq Scout', 2022, 24000, 1150000, 'in_stock', 'Scout 4x4, DSG, panoramik tavan, sanal gösterge paneli.', 'diesel', 'automatic', 'suv', 150, 1968, '4wd', 'Olive Green'),
('a1000001-0000-0000-0000-000000000044', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Genesis G80 3.5T AWD', 'Genesis', 'G80', 2023, 14000, 3200000, 'reserved', 'Sport Prestige, Lexicon ses sistemi, çift ekran, 360 kamera.', 'gasoline', 'automatic', 'sedan', 375, 3470, 'awd', 'Uyuni White'),
('a1000001-0000-0000-0000-000000000045', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Alfa Romeo Giulia Veloce', 'Alfa Romeo', 'Giulia Veloce', 2020, 42000, 1400000, 'sold', 'Veloce, 280hp, Q4 AWD, deri koltuk, Harman Kardon.', 'gasoline', 'automatic', 'sedan', 280, 1995, 'awd', 'Alfa Red'),
('a1000001-0000-0000-0000-000000000046', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Ford Puma ST', 'Ford', 'Puma ST', 2022, 16000, 1100000, 'in_stock', 'ST paket, 200hp, MagneRide süspansiyon, Recaro koltuklar.', 'gasoline', 'manual', 'hatchback', 200, 1499, 'fwd', 'Frozen White'),
('a1000001-0000-0000-0000-000000000047', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Jaguar F-Pace R-Dynamic', 'Jaguar', 'F-Pace', 2021, 38000, 2600000, 'in_stock', 'R-Dynamic HSE, meridian ses, panoramik tavan, air süspansiyon.', 'diesel', 'automatic', 'suv', 204, 1997, 'awd', 'Eiger Grey'),
('a1000001-0000-0000-0000-000000000048', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Peugeot 508 GT Hybrid', 'Peugeot', '508 GT', 2023, 11000, 1680000, 'in_stock', 'GT PHEV 225hp, 60km elektrik menzili, Focal ses sistemi.', 'hybrid', 'automatic', 'sedan', 225, 1598, 'fwd', 'Selenium Grey'),
('a1000001-0000-0000-0000-000000000049', 'd105c232-e87c-4a8b-8154-d4b716666909', '2019 Subaru Forester e-Boxer', 'Subaru', 'Forester', 2019, 58000, 980000, 'sold', 'e-Boxer hibrit, simetrik AWD, EyeSight güvenlik sistemi.', 'hybrid', 'automatic', 'suv', 150, 1995, 'awd', 'Crystal White'),
('a1000001-0000-0000-0000-000000000050', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Cupra Born 77kWh', 'Cupra', 'Born', 2022, 14000, 1350000, 'in_stock', '231hp, 77kWh, 540km menzil, spor koltuklar, augmented HUD.', 'electric', 'automatic', 'hatchback', 231, NULL, 'rwd', 'Petrol Blue'),
('a1000001-0000-0000-0000-000000000051', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Maserati Ghibli Hybrid', 'Maserati', 'Ghibli', 2021, 29000, 4800000, 'reserved', 'Hybrid, 330hp, Harman Kardon, deri döşeme, 20" jant.', 'hybrid', 'automatic', 'sedan', 330, 1995, 'rwd', 'Bianco Birdcage'),
('a1000001-0000-0000-0000-000000000052', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Nissan Leaf e+', 'Nissan', 'Leaf e+', 2020, 40000, 680000, 'sold', '62kWh, 385km menzil, ProPILOT, e-Pedal sürüş.', 'electric', 'automatic', 'hatchback', 218, NULL, 'fwd', 'Pearl White'),
('a1000001-0000-0000-0000-000000000053', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 BMW X5 xDrive40i', 'BMW', 'X5', 2023, 16000, 5200000, 'in_stock', 'M Sport, Bowers & Wilkins, Panorama Glass Roof, çift ekran.', 'gasoline', 'automatic', 'suv', 340, 2998, 'awd', 'Carbon Black'),
('a1000001-0000-0000-0000-000000000054', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Citroën ë-C4 Electric', 'Citroen', 'ë-C4', 2022, 21000, 920000, 'in_stock', '136hp, 50kWh, 350km menzil, Advanced Comfort koltuklar.', 'electric', 'automatic', 'hatchback', 136, NULL, 'fwd', 'Vert Emeraude'),
('a1000001-0000-0000-0000-000000000055', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Volkswagen Tiguan R', 'Volkswagen', 'Tiguan R', 2021, 27000, 2400000, 'in_stock', '320hp, 4Motion, DCC süspansiyon, Akrapovič egzoz.', 'gasoline', 'automatic', 'suv', 320, 1984, '4wd', 'Lapiz Blue'),
('a1000001-0000-0000-0000-000000000056', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Dacia Jogger Hybrid', 'Dacia', 'Jogger', 2023, 9000, 720000, 'in_stock', 'Extreme paket, 140hp hibrit, 7 koltuk, bagaj rafı.', 'hybrid', 'automatic', 'station_wagon', 140, 1598, 'fwd', 'Cedar Green'),
('a1000001-0000-0000-0000-000000000057', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Mercedes A250 AMG', 'Mercedes', 'A250', 2020, 44000, 1450000, 'sold', 'AMG Line, MBUX, panoramik tavan, adaptif cruise.', 'gasoline', 'automatic', 'hatchback', 224, 1991, 'fwd', 'Mountain Grey'),
('a1000001-0000-0000-0000-000000000058', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Lexus NX 350h AWD', 'Lexus', 'NX 350h', 2022, 20000, 2750000, 'reserved', 'F Sport Design, Mark Levinson ses, 14" ekran, panoramik tavan.', 'hybrid', 'automatic', 'suv', 244, 2487, 'awd', 'Sonic Titanium'),
('a1000001-0000-0000-0000-000000000059', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Opel Mokka-e Electric', 'Opel', 'Mokka-e', 2021, 31000, 740000, 'sold', '136hp, 50kWh, 338km menzil, IntelliLux LED Pixel farlar.', 'electric', 'automatic', 'suv', 136, NULL, 'fwd', 'Lava Red'),
('a1000001-0000-0000-0000-000000000060', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Mercedes EQB 350 AMG', 'Mercedes', 'EQB 350', 2023, 10000, 3100000, 'in_stock', 'AMG Line, 292hp, 7 koltuk, 66.5kWh, 419km menzil.', 'electric', 'automatic', 'suv', 292, NULL, 'awd', 'Polar White');

-- =========================
-- 30 MÜŞTERİ
-- =========================
INSERT INTO customers (id, user_id, name, phone) VALUES
('b2000001-0000-0000-0000-000000000031', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Tarık Çelik', '0532 401 5511'),
('b2000001-0000-0000-0000-000000000032', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Sibel Karahan', '0535 402 6622'),
('b2000001-0000-0000-0000-000000000033', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Yasin Doğru', '0542 403 7733'),
('b2000001-0000-0000-0000-000000000034', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Aysun Güler', '0538 404 8844'),
('b2000001-0000-0000-0000-000000000035', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Volkan Şen', '0530 405 9955'),
('b2000001-0000-0000-0000-000000000036', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Pınar Ateş', '0533 406 0066'),
('b2000001-0000-0000-0000-000000000037', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Cengiz Kurt', '0544 407 1177'),
('b2000001-0000-0000-0000-000000000038', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Reyhan Yavuz', '0536 408 2288'),
('b2000001-0000-0000-0000-000000000039', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Fehmi Güneş', '0541 409 3399'),
('b2000001-0000-0000-0000-000000000040', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Tülay Özmen', '0537 410 4400'),
('b2000001-0000-0000-0000-000000000041', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Selim Arslan', '0539 411 5511'),
('b2000001-0000-0000-0000-000000000042', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Nalan Kırmızı', '0545 412 6622'),
('b2000001-0000-0000-0000-000000000043', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Orhan Demir', '0531 413 7733'),
('b2000001-0000-0000-0000-000000000044', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Filiz Uçar', '0534 414 8844'),
('b2000001-0000-0000-0000-000000000045', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Adnan Türk', '0543 415 9955'),
('b2000001-0000-0000-0000-000000000046', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Gökhan Yıldırım', '0538 416 0066'),
('b2000001-0000-0000-0000-000000000047', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Şeyma Kaya', '0542 417 1177'),
('b2000001-0000-0000-0000-000000000048', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Levent Bozkurt', '0535 418 2288'),
('b2000001-0000-0000-0000-000000000049', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Aylin Sarı', '0532 419 3399'),
('b2000001-0000-0000-0000-000000000050', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Tolga Erdoğan', '0544 420 4400'),
('b2000001-0000-0000-0000-000000000051', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Zehra Çetin', '0530 421 5511'),
('b2000001-0000-0000-0000-000000000052', 'd105c232-e87c-4a8b-8154-d4b716666909', 'İlhan Başaran', '0536 422 6622'),
('b2000001-0000-0000-0000-000000000053', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Canan Polat', '0541 423 7733'),
('b2000001-0000-0000-0000-000000000054', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Hakan Özkan', '0533 424 8844'),
('b2000001-0000-0000-0000-000000000055', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Melike Aydın', '0539 425 9955'),
('b2000001-0000-0000-0000-000000000056', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Uğur Kılıç', '0545 426 0066'),
('b2000001-0000-0000-0000-000000000057', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Sevgi Taş', '0531 427 1177'),
('b2000001-0000-0000-0000-000000000058', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Berk Yalçın', '0534 428 2288'),
('b2000001-0000-0000-0000-000000000059', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Ece Korkmaz', '0543 429 3399'),
('b2000001-0000-0000-0000-000000000060', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Furkan Aksoy', '0537 430 4400');

-- =========================
-- 30 İLGİ KAYDI
-- =========================
INSERT INTO car_interests (id, car_id, customer_id, status, note) VALUES
('c3000001-0000-0000-0000-000000000031', 'a1000001-0000-0000-0000-000000000031', 'b2000001-0000-0000-0000-000000000031', 'interested', 'Porsche Macan için bilgi aldı, renk seçeneklerini sordu.'),
('c3000001-0000-0000-0000-000000000032', 'a1000001-0000-0000-0000-000000000032', 'b2000001-0000-0000-0000-000000000032', 'test_drive', 'Defender test sürüşü yapıldı, off-road kapasitesini beğendi.'),
('c3000001-0000-0000-0000-000000000033', 'a1000001-0000-0000-0000-000000000033', 'b2000001-0000-0000-0000-000000000033', 'negotiating', 'M3 için kredi başvurusu açıldı, teslim tarihi görüşülüyor.'),
('c3000001-0000-0000-0000-000000000034', 'a1000001-0000-0000-0000-000000000034', 'b2000001-0000-0000-0000-000000000034', 'sold', 'GLE 350d anlaşma sağlandı, teslim edildi.'),
('c3000001-0000-0000-0000-000000000035', 'a1000001-0000-0000-0000-000000000035', 'b2000001-0000-0000-0000-000000000035', 'interested', 'RS6 Avant görmek istiyor, randevu planlandı.'),
('c3000001-0000-0000-0000-000000000036', 'a1000001-0000-0000-0000-000000000036', 'b2000001-0000-0000-0000-000000000036', 'interested', 'HR-V bütçeye uygun, eşiyle birlikte bakacak.'),
('c3000001-0000-0000-0000-000000000037', 'a1000001-0000-0000-0000-000000000037', 'b2000001-0000-0000-0000-000000000037', 'test_drive', 'Ioniq 6 test sürüşü çok beğenildi, şarj altyapısı soruldu.'),
('c3000001-0000-0000-0000-000000000038', 'a1000001-0000-0000-0000-000000000038', 'b2000001-0000-0000-0000-000000000038', 'sold', 'Passat TDI satıldı, müşteri çok memnun.'),
('c3000001-0000-0000-0000-000000000039', 'a1000001-0000-0000-0000-000000000039', 'b2000001-0000-0000-0000-000000000039', 'negotiating', 'EV6 için takas teklifi değerlendiriliyor.'),
('c3000001-0000-0000-0000-000000000040', 'a1000001-0000-0000-0000-000000000040', 'b2000001-0000-0000-0000-000000000040', 'interested', 'Land Cruiser iş için lazım, finansman seçenekleri soruldu.'),
('c3000001-0000-0000-0000-000000000041', 'a1000001-0000-0000-0000-000000000041', 'b2000001-0000-0000-0000-000000000041', 'interested', 'Mini Cabrio eşine alınacak, renk seçimi yapılıyor.'),
('c3000001-0000-0000-0000-000000000042', 'a1000001-0000-0000-0000-000000000042', 'b2000001-0000-0000-0000-000000000042', 'sold', 'Clio satıldı, ilk araç olarak aldı.'),
('c3000001-0000-0000-0000-000000000043', 'a1000001-0000-0000-0000-000000000043', 'b2000001-0000-0000-0000-000000000043', 'test_drive', 'Karoq Scout dağ için incelendi, AWD sistemi soruldu.'),
('c3000001-0000-0000-0000-000000000044', 'a1000001-0000-0000-0000-000000000044', 'b2000001-0000-0000-0000-000000000044', 'negotiating', 'Genesis G80 için fiyat pazarlığı yapılıyor.'),
('c3000001-0000-0000-0000-000000000045', 'a1000001-0000-0000-0000-000000000045', 'b2000001-0000-0000-0000-000000000045', 'sold', 'Giulia Veloce satıldı, müşteri İtalyan otomobil sever.'),
('c3000001-0000-0000-0000-000000000046', 'a1000001-0000-0000-0000-000000000046', 'b2000001-0000-0000-0000-000000000046', 'interested', 'Puma ST performans için inceleniyor, renk beğenildi.'),
('c3000001-0000-0000-0000-000000000047', 'a1000001-0000-0000-0000-000000000047', 'b2000001-0000-0000-0000-000000000047', 'test_drive', 'F-Pace test sürüşü, air süspansiyon çok beğenildi.'),
('c3000001-0000-0000-0000-000000000048', 'a1000001-0000-0000-0000-000000000048', 'b2000001-0000-0000-0000-000000000048', 'interested', 'Peugeot 508 PHEV yakıt tasarrufu için sorgulandı.'),
('c3000001-0000-0000-0000-000000000049', 'a1000001-0000-0000-0000-000000000049', 'b2000001-0000-0000-0000-000000000049', 'sold', 'Forester e-Boxer aile için alındı, AWD tercih sebebi.'),
('c3000001-0000-0000-0000-000000000050', 'a1000001-0000-0000-0000-000000000050', 'b2000001-0000-0000-0000-000000000050', 'interested', 'Cupra Born genç müşteri, elektrikli araç ilk kez değerlendiriyor.'),
('c3000001-0000-0000-0000-000000000051', 'a1000001-0000-0000-0000-000000000051', 'b2000001-0000-0000-0000-000000000051', 'negotiating', 'Maserati Ghibli için özel finansman paketi hazırlanıyor.'),
('c3000001-0000-0000-0000-000000000052', 'a1000001-0000-0000-0000-000000000052', 'b2000001-0000-0000-0000-000000000052', 'sold', 'Nissan Leaf şehir içi için alındı, menzil yeterli geldi.'),
('c3000001-0000-0000-0000-000000000053', 'a1000001-0000-0000-0000-000000000053', 'b2000001-0000-0000-0000-000000000053', 'interested', 'X5 kurumsal araç olarak değerlendiriliyor.'),
('c3000001-0000-0000-0000-000000000054', 'a1000001-0000-0000-0000-000000000054', 'b2000001-0000-0000-0000-000000000054', 'test_drive', 'Citroën ë-C4 test edildi, konfor süspansiyon çok beğenildi.'),
('c3000001-0000-0000-0000-000000000055', 'a1000001-0000-0000-0000-000000000055', 'b2000001-0000-0000-0000-000000000055', 'negotiating', 'Tiguan R için sport paket fiyatı görüşülüyor.'),
('c3000001-0000-0000-0000-000000000056', 'a1000001-0000-0000-0000-000000000056', 'b2000001-0000-0000-0000-000000000056', 'interested', 'Dacia Jogger 7 kişilik olduğu için aile tercihi.'),
('c3000001-0000-0000-0000-000000000057', 'a1000001-0000-0000-0000-000000000057', 'b2000001-0000-0000-0000-000000000057', 'sold', 'Mercedes A250 satıldı, genç profesyonel aldı.'),
('c3000001-0000-0000-0000-000000000058', 'a1000001-0000-0000-0000-000000000058', 'b2000001-0000-0000-0000-000000000058', 'test_drive', 'Lexus NX 350h sessizliği ve konforuyla çok beğenildi.'),
('c3000001-0000-0000-0000-000000000059', 'a1000001-0000-0000-0000-000000000059', 'b2000001-0000-0000-0000-000000000059', 'sold', 'Mokka-e şehir içi elektrikli olarak satıldı.'),
('c3000001-0000-0000-0000-000000000060', 'a1000001-0000-0000-0000-000000000060', 'b2000001-0000-0000-0000-000000000060', 'interested', 'EQB 350 7 koltuk ve elektrikli kombinasyonu ilgi çekti.');

COMMIT;
