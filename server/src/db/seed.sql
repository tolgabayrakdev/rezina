-- Seed data for user_id: d105c232-e87c-4a8b-8154-d4b716666909
-- 30 cars, 30 customers, 30 interests

BEGIN;

-- =========================
-- 30 ARAÇ
-- =========================
INSERT INTO cars (id, user_id, title, brand, model, year, mileage, price, status, description, fuel_type, transmission, body_type, engine_power, engine_volume, drive_type, color) VALUES
('a1000001-0000-0000-0000-000000000001', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 BMW 320i M Sport', 'BMW', '320i', 2023, 12000, 1850000, 'in_stock', 'M Sport paket, panoramik cam tavan, LED farlar.', 'gasoline', 'automatic', 'sedan', 184, 1998, 'rwd', 'Alpine White'),
('a1000001-0000-0000-0000-000000000002', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Mercedes C200 AMG', 'Mercedes', 'C200', 2022, 25000, 2100000, 'reserved', 'AMG Line, deri koltuk, ısıtmalı koltuk.', 'gasoline', 'automatic', 'sedan', 204, 1497, 'rwd', 'Obsidian Black'),
('a1000001-0000-0000-0000-000000000003', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Audi A4 S-Line', 'Audi', 'A4', 2021, 35000, 1650000, 'sold', 'S-Line iç-dış paket, virtual cockpit.', 'gasoline', 'automatic', 'sedan', 150, 1984, 'fwd', 'Glacier White'),
('a1000001-0000-0000-0000-000000000004', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Volkswagen Golf R', 'Volkswagen', 'Golf R', 2023, 8000, 2200000, 'in_stock', '4Motion, DSG, Akrapoviç egzoz.', 'gasoline', 'automatic', 'hatchback', 333, 1984, '4wd', 'Lapiz Blue'),
('a1000001-0000-0000-0000-000000000005', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Toyota Corolla Hybrid', 'Toyota', 'Corolla', 2020, 45000, 950000, 'sold', 'Hybrid, otomatik, şehir içi düşük yakıt tüketimi.', 'hybrid', 'automatic', 'sedan', 122, 1798, 'fwd', 'White Pearl'),
('a1000001-0000-0000-0000-000000000006', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Honda Civic Elegance', 'Honda', 'Civic', 2022, 20000, 1100000, 'in_stock', 'VTEC Turbo, CVT, adaptif cruise control.', 'gasoline', 'automatic', 'sedan', 182, 1498, 'fwd', 'Lunar Silver'),
('a1000001-0000-0000-0000-000000000007', 'd105c232-e87c-4a8b-8154-d4b716666909', '2019 Ford Focus ST-Line', 'Ford', 'Focus', 2019, 60000, 750000, 'sold', 'ST-Line paket, SYNC 3, geri görüş kamera.', 'gasoline', 'manual', 'hatchback', 150, 1498, 'fwd', 'Magnetic Grey'),
('a1000001-0000-0000-0000-000000000008', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Renault Megane E-Tech', 'Renault', 'Megane E-Tech', 2023, 5000, 1450000, 'in_stock', 'Elektrikli, 600km menzil, OpenR Link ekran.', 'electric', 'automatic', 'hatchback', 220, NULL, 'fwd', 'Midnight Blue'),
('a1000001-0000-0000-0000-000000000009', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Peugeot 3008 GT', 'Peugeot', '3008', 2021, 40000, 1250000, 'reserved', 'GT paket, i-Cockpit, night vision.', 'gasoline', 'automatic', 'suv', 225, 1598, '4wd', 'Nera Black'),
('a1000001-0000-0000-0000-000000000010', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Opel Insignia Grand Sport', 'Opel', 'Insignia', 2020, 55000, 850000, 'in_stock', 'Grand Sport, IntelliLux LED, AGR koltuklar.', 'diesel', 'automatic', 'sedan', 170, 1998, 'fwd', 'Sovereign Silver'),
('a1000001-0000-0000-0000-000000000011', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Hyundai Tucson Premium', 'Hyundai', 'Tucson', 2022, 18000, 1350000, 'sold', 'Premium paket, hybrid, BOSE ses sistemi.', 'hybrid', 'automatic', 'suv', 230, 1598, 'awd', 'Phantom Black'),
('a1000001-0000-0000-0000-000000000012', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Kia Sportage GT-Line', 'Kia', 'Sportage', 2023, 10000, 1550000, 'in_stock', 'GT-Line, 1.6 T-GDi, panoramik tavan.', 'gasoline', 'automatic', 'suv', 180, 1598, 'fwd', 'Interstellar Grey'),
('a1000001-0000-0000-0000-000000000013', 'd105c232-e87c-4a8b-8154-d4b716666909', '2018 Fiat Egea Cross', 'Fiat', 'Egea Cross', 2018, 80000, 450000, 'sold', 'Cross paket, 1.6 MultiJet, uygun fiyatlı aile aracı.', 'diesel', 'manual', 'sedan', 120, 1598, 'fwd', 'Bianco Gelato'),
('a1000001-0000-0000-0000-000000000014', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Skoda Octavia RS', 'Skoda', 'Octavia RS', 2021, 30000, 1400000, 'in_stock', 'RS paket, 245hp, DCC süspansiyon.', 'gasoline', 'automatic', 'sedan', 245, 1984, '4wd', 'Moon White'),
('a1000001-0000-0000-0000-000000000015', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Mazda CX-5 Signature', 'Mazda', 'CX-5', 2022, 22000, 1300000, 'reserved', 'Signature, SKYACTIV-X, Nappa deri koltuk.', 'gasoline', 'automatic', 'suv', 194, 2488, 'awd', 'Soul Red Crystal'),
('a1000001-0000-0000-0000-000000000016', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Nissan Qashqai Tekna', 'Nissan', 'Qashqai', 2020, 48000, 900000, 'in_stock', 'Tekna Plus, ProPILOT, panoramik cam tavan.', 'gasoline', 'automatic', 'suv', 160, 1332, 'fwd', 'Magnetic Red'),
('a1000001-0000-0000-0000-000000000017', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 Tesla Model 3 Long Range', 'Tesla', 'Model 3', 2023, 15000, 2400000, 'in_stock', 'Long Range, Autopilot, beyaz interior.', 'electric', 'automatic', 'sedan', 358, NULL, 'awd', 'Pearl White'),
('a1000001-0000-0000-0000-000000000018', 'd105c232-e87c-4a8b-8154-d4b716666909', '2019 Dacia Duster Prestige', 'Dacia', 'Duster', 2019, 70000, 520000, 'sold', 'Prestige, 4x4, dizel, ekonomik SUV.', 'diesel', 'manual', 'suv', 115, 1498, '4wd', 'Kaolin Beige'),
('a1000001-0000-0000-0000-000000000019', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Volvo XC60 Inscription', 'Volvo', 'XC60', 2021, 28000, 2300000, 'in_stock', 'Inscription, B5 mild hybrid, Harman Kardon.', 'hybrid', 'automatic', 'suv', 250, 1969, 'awd', 'Crystal White'),
('a1000001-0000-0000-0000-000000000020', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Cupra Formentor VZ', 'Cupra', 'Formentor', 2022, 16000, 1750000, 'reserved', 'VZ, 310hp, 4Drive, Brembo frenler.', 'gasoline', 'automatic', 'suv', 310, 1984, '4wd', 'Desert Black'),
('a1000001-0000-0000-0000-000000000021', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Citroen C5 Aircross Shine', 'Citroen', 'C5 Aircross', 2020, 42000, 980000, 'in_stock', 'Shine Pack, Advanced Comfort koltuklar.', 'gasoline', 'automatic', 'suv', 180, 1598, 'fwd', 'Pearl White'),
('a1000001-0000-0000-0000-000000000022', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 MG4 Electric', 'MG', 'MG4', 2023, 7000, 1150000, 'in_stock', '77kWh, 520km menzil, hızlı şarj desteği.', 'electric', 'automatic', 'hatchback', 204, NULL, 'rwd', 'Pebble Black'),
('a1000001-0000-0000-0000-000000000023', 'd105c232-e87c-4a8b-8154-d4b716666909', '2017 BMW 520d Luxury', 'BMW', '520d', 2017, 95000, 1200000, 'sold', 'Luxury Line, head-up display, harman/kardon.', 'diesel', 'automatic', 'sedan', 190, 1995, 'rwd', 'Carbon Black'),
('a1000001-0000-0000-0000-000000000024', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Mercedes GLA 200 AMG', 'Mercedes', 'GLA 200', 2022, 20000, 1950000, 'in_stock', 'AMG Line, MBUX, 64 renk ambiyans aydınlatma.', 'gasoline', 'automatic', 'suv', 163, 1332, 'fwd', 'Polar White'),
('a1000001-0000-0000-0000-000000000025', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Toyota RAV4 Adventure', 'Toyota', 'RAV4', 2021, 32000, 1500000, 'reserved', 'Adventure, hybrid AWD, JBL ses sistemi.', 'hybrid', 'automatic', 'suv', 222, 2487, 'awd', 'Magnetic Grey'),
('a1000001-0000-0000-0000-000000000026', 'd105c232-e87c-4a8b-8154-d4b716666909', '2020 Seat Leon FR', 'Seat', 'Leon', 2020, 50000, 850000, 'in_stock', 'FR, 1.5 TSI, Digital Cockpit, Beats Audio.', 'gasoline', 'automatic', 'hatchback', 150, 1498, 'fwd', 'Magnetic Grey'),
('a1000001-0000-0000-0000-000000000027', 'd105c232-e87c-4a8b-8154-d4b716666909', '2023 BYD Atto 3', 'BYD', 'Atto 3', 2023, 3000, 1050000, 'in_stock', '60.5kWh, Blade Battery, 360 kamera.', 'electric', 'automatic', 'suv', 204, NULL, 'fwd', 'Boulder Grey'),
('a1000001-0000-0000-0000-000000000028', 'd105c232-e87c-4a8b-8154-d4b716666909', '2018 Mercedes E220d AMG', 'Mercedes', 'E220d', 2018, 85000, 1650000, 'sold', 'AMG Line, Distronic Plus, 360 kamera.', 'diesel', 'automatic', 'sedan', 194, 1950, 'rwd', 'Selenite Grey'),
('a1000001-0000-0000-0000-000000000029', 'd105c232-e87c-4a8b-8154-d4b716666909', '2022 Audi Q3 S-Line', 'Audi', 'Q3', 2022, 19000, 1800000, 'in_stock', 'S-Line, Virtual Plus, Matrix LED farlar.', 'gasoline', 'automatic', 'suv', 150, 1984, 'fwd', 'Mythos Black'),
('a1000001-0000-0000-0000-000000000030', 'd105c232-e87c-4a8b-8154-d4b716666909', '2021 Volkswagen ID.4 Pro', 'Volkswagen', 'ID.4', 2021, 25000, 1400000, 'in_stock', 'Pro, 77kWh, AR head-up display.', 'electric', 'automatic', 'suv', 204, NULL, 'rwd', 'Starlight Silver');

-- =========================
-- 30 MÜŞTERİ
-- =========================
INSERT INTO customers (id, user_id, name, phone) VALUES
('b2000001-0000-0000-0000-000000000001', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Ahmet Yılmaz', '0532 111 2233'),
('b2000001-0000-0000-0000-000000000002', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Fatma Demir', '0535 222 3344'),
('b2000001-0000-0000-0000-000000000003', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Mehmet Kaya', '0542 333 4455'),
('b2000001-0000-0000-0000-000000000004', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Ayşe Çelik', '0538 444 5566'),
('b2000001-0000-0000-0000-000000000005', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Ali Öztürk', '0530 555 6677'),
('b2000001-0000-0000-0000-000000000006', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Zeynep Arslan', '0533 666 7788'),
('b2000001-0000-0000-0000-000000000007', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Mustafa Aydın', '0544 777 8899'),
('b2000001-0000-0000-0000-000000000008', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Elif Şahin', '0536 888 9900'),
('b2000001-0000-0000-0000-000000000009', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Hasan Yıldız', '0541 999 0011'),
('b2000001-0000-0000-0000-000000000010', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Emine Kılıç', '0537 100 1122'),
('b2000001-0000-0000-0000-000000000011', 'd105c232-e87c-4a8b-8154-d4b716666909', 'İbrahim Özdemir', '0539 200 2233'),
('b2000001-0000-0000-0000-000000000012', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Hatice Doğan', '0545 300 3344'),
('b2000001-0000-0000-0000-000000000013', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Osman Kara', '0531 400 4455'),
('b2000001-0000-0000-0000-000000000014', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Merve Erdoğan', '0534 500 5566'),
('b2000001-0000-0000-0000-000000000015', 'd105c232-e87c-4a8b-8154-d4b716666909', ' Hüseyin Aksoy', '0543 600 6677'),
('b2000001-0000-0000-0000-000000000016', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Selin Yılmaz', '0538 700 7788'),
('b2000001-0000-0000-0000-000000000017', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Burak Koç', '0542 800 8899'),
('b2000001-0000-0000-0000-000000000018', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Gül Demirci', '0535 900 9900'),
('b2000001-0000-0000-0000-000000000019', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Serkan Polat', '0532 111 0011'),
('b2000001-0000-0000-0000-000000000020', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Derya Çetin', '0544 222 1122'),
('b2000001-0000-0000-0000-000000000021', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Kemal Bulut', '0530 333 2233'),
('b2000001-0000-0000-0000-000000000022', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Nur Avcı', '0536 444 3344'),
('b2000001-0000-0000-0000-000000000023', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Emre Taş', '0541 555 4455'),
('b2000001-0000-0000-0000-000000000024', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Cansu Yalçın', '0533 666 5566'),
('b2000001-0000-0000-0000-000000000025', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Murat Aydın', '0539 777 6677'),
('b2000001-0000-0000-0000-000000000026', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Buse Korkmaz', '0545 888 7788'),
('b2000001-0000-0000-0000-000000000027', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Oğuz Özkan', '0531 999 8899'),
('b2000001-0000-0000-0000-000000000028', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Aslı Ersoy', '0534 100 9900'),
('b2000001-0000-0000-0000-000000000029', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Barış Kaplan', '0543 200 0011'),
('b2000001-0000-0000-0000-000000000030', 'd105c232-e87c-4a8b-8154-d4b716666909', 'Deniz Şimşek', '0537 300 1122');

-- =========================
-- 30 İLGİ KAYDI
-- =========================
INSERT INTO car_interests (id, car_id, customer_id, status, note) VALUES
('c3000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', 'interested', 'BMW ile ilgileniyor, fiyat sordu.'),
('c3000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002', 'test_drive', 'Test sürüşü yaptı, çok beğendi.'),
('c3000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000003', 'sold', 'Anlaşıldı, satış tamamlandı.'),
('c3000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000004', 'negotiating', 'Fiyat pazarlığı devam ediyor.'),
('c3000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000005', 'sold', 'Hybrid araç satıldı.'),
('c3000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000006', 'interested', 'Civic ile ilgileniyor.'),
('c3000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000007', 'sold', 'Focus satıldı, teslim edildi.'),
('c3000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000008', 'test_drive', 'Elektrikli araç test sürüşü planlandı.'),
('c3000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000009', 'negotiating', 'Takas teklifi var.'),
('c3000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000010', 'lost', 'Başka araç tercih etti.'),
('c3000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000011', 'b2000001-0000-0000-0000-000000000011', 'sold', 'Tucson satıldı.'),
('c3000001-0000-0000-0000-000000000012', 'a1000001-0000-0000-0000-000000000012', 'b2000001-0000-0000-0000-000000000012', 'interested', 'Sportage hakkında bilgi aldı.'),
('c3000001-0000-0000-0000-000000000013', 'a1000001-0000-0000-0000-000000000013', 'b2000001-0000-0000-0000-000000000013', 'sold', 'Egea satıldı.'),
('c3000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000014', 'b2000001-0000-0000-0000-000000000014', 'test_drive', 'Octavia RS test sürüşü yapıldı.'),
('c3000001-0000-0000-0000-000000000015', 'a1000001-0000-0000-0000-000000000015', 'b2000001-0000-0000-0000-000000000015', 'negotiating', 'Fiyatta anlaşma sağlanamadı.'),
('c3000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000016', 'b2000001-0000-0000-0000-000000000016', 'interested', 'Qashqai için randevu istedi.'),
('c3000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000017', 'b2000001-0000-0000-0000-000000000017', 'interested', 'Tesla Model 3 çok ilgisini çekti.'),
('c3000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000018', 'b2000001-0000-0000-0000-000000000018', 'sold', 'Duster satıldı.'),
('c3000001-0000-0000-0000-000000000019', 'a1000001-0000-0000-0000-000000000019', 'b2000001-0000-0000-0000-000000000019', 'test_drive', 'Volvo test sürüşü sonrası düşünecek.'),
('c3000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000020', 'b2000001-0000-0000-0000-000000000020', 'negotiating', 'Cupra için kredi başvurusu yaptı.'),
('c3000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000021', 'b2000001-0000-0000-0000-000000000021', 'interested', 'C5 Aircross aile aracı olarak düşünüyor.'),
('c3000001-0000-0000-0000-000000000022', 'a1000001-0000-0000-0000-000000000022', 'b2000001-0000-0000-0000-000000000022', 'interested', 'MG4 elektrikli araç ilgisi var.'),
('c3000001-0000-0000-0000-000000000023', 'a1000001-0000-0000-0000-000000000023', 'b2000001-0000-0000-0000-000000000023', 'sold', 'BMW 520d satıldı.'),
('c3000001-0000-0000-0000-000000000024', 'a1000001-0000-0000-0000-000000000024', 'b2000001-0000-0000-0000-000000000024', 'test_drive', 'GLA test sürüşü yapıldı.'),
('c3000001-0000-0000-0000-000000000025', 'a1000001-0000-0000-0000-000000000025', 'b2000001-0000-0000-0000-000000000025', 'negotiating', 'RAV4 için takas teklifi değerlendiriliyor.'),
('c3000001-0000-0000-0000-000000000026', 'a1000001-0000-0000-0000-000000000026', 'b2000001-0000-0000-0000-000000000026', 'interested', 'Leon FR fiyatı uygun geldi.'),
('c3000001-0000-0000-0000-000000000027', 'a1000001-0000-0000-0000-000000000027', 'b2000001-0000-0000-0000-000000000027', 'interested', 'BYD Atto 3 hakkında bilgi istedi.'),
('c3000001-0000-0000-0000-000000000028', 'a1000001-0000-0000-0000-000000000028', 'b2000001-0000-0000-0000-000000000028', 'sold', 'E220d satıldı.'),
('c3000001-0000-0000-0000-000000000029', 'a1000001-0000-0000-0000-000000000029', 'b2000001-0000-0000-0000-000000000029', 'test_drive', 'Q3 test sürüşü planlandı.'),
('c3000001-0000-0000-0000-000000000030', 'a1000001-0000-0000-0000-000000000030', 'b2000001-0000-0000-0000-000000000030', 'interested', 'ID.4 elektrikli VW ilgisi var.');

COMMIT;
