PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_initial.sql','2026-06-01 08:09:01');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_ui_configs.sql','2026-06-01 16:58:23');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0003_ui_configs_kv.sql','2026-06-01 16:58:23');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(4,'0004_partner_onboarding.sql','2026-06-29 11:16:45');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(5,'0004_parched_masked_marvel.sql','2026-07-20 11:34:54');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(6,'0005_flippant_kabuki.sql','2026-07-20 11:34:54');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(7,'0006_gray_stepford_cuckoos.sql','2026-07-20 11:34:54');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(8,'0007_shocking_shatterstar.sql','2026-07-20 11:34:54');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(9,'0008_needy_vermin.sql','2026-07-20 11:34:55');
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER','PARTNER','ADMIN')),
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by TEXT,
  updated_by TEXT
);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_admin','admin@credupe.local',NULL,'$2a$10$FKCCmHhwRRnLsxHTG3hFxu/HJdZtoIpP6lUoCXp7HW2zVMi7voJSe','ADMIN',1,'2026-06-26T11:24:53.235Z','2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_customer','customer@credupe.local',NULL,'$2a$10$BL0m0E1690W.TDfbgWLoIe026mvMZtH046pdbJXmeAV6UOVkq18VS','CUSTOMER',1,'2026-06-01T08:40:03.998Z','2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_partner','partner@credupe.local',NULL,'$2a$10$DFK0lJU8P/hxNRGJNzwXu.laytf/lHmv.Zh5BdtQgA/dFJ.YUt2la','PARTNER',1,'2026-07-29T05:56:18.785Z','2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_3q3p3i6y6u031l093u525h','jayeshprofessionals@gmail.com','+8830549719','$2a$10$/.BP8kPVwlY58wULrremuOepnTIrdK4QL75FkQjbX3VLJb02IPZ/.','ADMIN',1,'2026-07-20T08:51:21.706Z','2026-06-01 11:30:56','2026-06-01 11:30:56',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_1g1n0l5y252k154z31243y','maheshmehta79@gmail.com','+9820553547','$2a$10$vdD5.I3TU5K6qWNg0o8ofurSyhU2h324oyOOJTj1Mb79Al4dwQyaS','ADMIN',1,'2026-06-01T17:15:32.435Z','2026-06-01 17:13:58','2026-06-01 17:13:58',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_3g344c1940344h025u1502','aniket2804@gmail.com','+8310732248','$2a$10$JrKww1.ugFHXQQj8kooqIeUhSzCl64UJmbT3fQL9UKWIHaLpit12e','CUSTOMER',1,NULL,'2026-06-22 17:22:41','2026-06-22 17:22:41',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_1a5k1o5l276q4b4z6w6z3s','jayeshprofessionals+2@gmail.com','+918830549719','$2a$10$RzR315ZN5jIFXQ882PrSMenoSs//7fmvCez2F6Auq3AnrgIxbOq9O','PARTNER',1,'2026-06-29T11:34:27.000Z','2026-06-29 11:34:01','2026-06-29 11:34:01',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_0z6770296v582l1l4i3q38','av457508@gmail.com','+918889354535','$2a$10$/2GY6dZKkdW7FB59grO5ru8JvuR3oUBs1j6sY.bIQYCg4cwSr9AM2','PARTNER',1,'2026-07-03T05:27:19.421Z','2026-07-03 05:27:19','2026-07-03 05:27:19',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_0u430q685i5i33554h4w62','pv457508@gmail.com','5383835865','$2a$10$.pk.L6qR/GjFJrTWQhFqGe/m2rFDeyZ8BMxb95bviQh0Z8LbtHPlW','PARTNER',1,'2026-07-22T12:35:48.944Z','2026-07-22 12:34:04','2026-07-22 12:34:04',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_4s03112f3x5t4q6g254p6h','testuser2225@example.com',NULL,'$2a$10$Hs.T649MxUavQLdkiFAI5ubzQQzFHkRwxIg1cj62NDT6.lxoC2Pki','CUSTOMER',1,NULL,'2026-07-29 07:54:29','2026-07-29 07:54:29',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_5x3w6b4058041k2g4a182c','testuser8425@example.com',NULL,'$2a$10$BEHpWIKHNGolHmh7GAjsi.dM0hvYKGUWtOS0tcU0owc5QQ7siPp66','CUSTOMER',1,NULL,'2026-07-29 07:54:50','2026-07-29 07:54:50',NULL,NULL,NULL);
INSERT INTO "users" ("id","email","mobile","password_hash","role","is_active","last_login_at","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('u_01602z2n6e6h551c1w2j6d','testuser9728@example.com',NULL,'$2a$10$PKE88CzHnlwDNW80fRq./e1yAGWeLFBqa4Bm42tP5de0BDkv0SoOy','CUSTOMER',1,NULL,'2026-07-29 08:01:29','2026-07-29 08:01:29',NULL,NULL,NULL);
CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6f0j500c5e3m5n195f5x43','u_customer','30b4e22bfa7762bd57af09f5cf9e0e0aa60d77bca759d39a8c9684513921c756','2026-07-01T08:40:04.197Z','2026-06-01T08:41:18.008Z',NULL,NULL,'2026-06-01 08:40:04');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_011t0s5r1m0u6d6a4z1j5g','u_3q3p3i6y6u031l093u525h','fc147e31eac45c8cb782e45bad0a95f07c8ce13a2fc3b427157e94f39f5cf48e','2026-07-01T11:30:56.463Z','2026-06-01T11:56:45.423Z',NULL,NULL,'2026-06-01 11:30:56');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3n1t6g3817492d0z5i3x0j','u_3q3p3i6y6u031l093u525h','a24bee04df985ce9694a0396cb152ceac5dc126f62b867a157bb51d829ce789d','2026-07-01T11:56:45.519Z','2026-06-01T17:00:50.202Z',NULL,NULL,'2026-06-01 11:56:45');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2o5c662t0s5p0f4v2r462s','u_3q3p3i6y6u031l093u525h','5605cdead5524286a1111cacd870f83ef01a24edaf16529c7966dc65c7c96214','2026-07-01T17:00:50.496Z','2026-06-01T17:02:09.093Z',NULL,NULL,'2026-06-01 17:00:50');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_105h3u1r105h641t0x622w','u_3q3p3i6y6u031l093u525h','9ab82223ccc76a85e1e5da99b4a9273832441c9f7f9b1392008958b2f2bde530','2026-07-01T17:02:31.616Z','2026-06-01T17:12:58.448Z',NULL,NULL,'2026-06-01 17:02:31');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4e1v1u505i384o143o604m','u_1g1n0l5y252k154z31243y','87845431dbd6c0d33add180595a18ba10e36d372d5fc61aa42be1f98a5bca0c0','2026-07-01T17:13:58.401Z','2026-06-01T17:15:17.629Z',NULL,NULL,'2026-06-01 17:13:58');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4b5557704y08313g4g4n5p','u_3q3p3i6y6u031l093u525h','74e62f7322178f54f1a3c380adf0a7fb2b4c0a868bf38a12e41fb48e93004fb9','2026-07-01T17:14:48.949Z','2026-06-02T07:36:46.734Z',NULL,NULL,'2026-06-01 17:14:49');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_29040e623k1g3c2h3r1g3m','u_1g1n0l5y252k154z31243y','55a93293f7421877ec1b9e61eb556248f8c15d30603db28b35754c1678f3acdc','2026-07-01T17:15:32.529Z','2026-06-02T18:05:52.119Z',NULL,NULL,'2026-06-01 17:15:32');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2n3j3i6m3j6n5x1m1u592z','u_3q3p3i6y6u031l093u525h','e1c31bdbd4fa68045fd7ce128fcce7bf85094a466a13c9c0775eb3c3343f9c41','2026-07-02T07:36:47.068Z','2026-06-02T09:50:41.004Z',NULL,NULL,'2026-06-02 07:36:47');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_680r3k3d0q6i672o5g700y','u_3q3p3i6y6u031l093u525h','7a9279dce35128f4c84a82a166b0a44483a1c38c08332175c9aa0ce0fba1b5f7','2026-07-02T09:50:41.384Z','2026-06-02T12:14:30.140Z',NULL,NULL,'2026-06-02 09:50:41');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_564b6x4p3h6l4a2i2e723u','u_3q3p3i6y6u031l093u525h','74efb96a2dbd7a0656620bc285a52e52fb801b3a219bf4d28c934a86c3d8703f','2026-07-02T12:14:30.479Z','2026-06-02T16:13:01.207Z',NULL,NULL,'2026-06-02 12:14:30');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5l1c6o2y3b4j1i0r223s0g','u_3q3p3i6y6u031l093u525h','c17d24840adf19b493e9f17fcf29c483b4c463174585377a38d2489eb17c0f21','2026-07-02T16:13:01.549Z','2026-06-02T17:57:08.635Z',NULL,NULL,'2026-06-02 16:13:01');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4c2e20726z6k4w3n1l2x0d','u_3q3p3i6y6u031l093u525h','e5e821b4376cbe8ae04fa84bb325a2287405e57107038d2d65b0ede9c435558f','2026-07-02T17:57:08.928Z','2026-06-10T12:32:08.018Z',NULL,NULL,'2026-06-02 17:57:09');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_1n5i194c1y305d3l202v0f','u_1g1n0l5y252k154z31243y','05431fe9e297e5c6fe98d467fea2489ad28f74a8f4acb2e8e27bc2555a90a675','2026-07-02T18:05:52.432Z','2026-06-15T10:55:23.330Z',NULL,NULL,'2026-06-02 18:05:52');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4d4b134z2y2l5u0j0d1q6m','u_3q3p3i6y6u031l093u525h','f55c77986afa27a3cee3e7ae222eaaf3bf1865ce04764d331513ecc88c258acf','2026-07-10T12:32:08.327Z','2026-06-11T08:15:09.680Z',NULL,NULL,'2026-06-10 12:32:08');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_7366474f2d413p6l191s30','u_3q3p3i6y6u031l093u525h','68f1c02b1a6e4fea14b5b94003ff4eeccdce4af3b200416ef3d53ff8027f1acd','2026-07-11T08:15:10.013Z','2026-06-11T13:35:53.602Z',NULL,NULL,'2026-06-11 08:15:10');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_1j5d4a2y1e481y3y6u3y2k','u_3q3p3i6y6u031l093u525h','8378dc678d7cf7dde17915c79764af77fa7674228e7fe1ef6004d5c49fa4c608','2026-07-11T13:35:53.924Z','2026-06-22T10:11:49.429Z',NULL,NULL,'2026-06-11 13:35:54');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_285o5j50526w3u2w1v666w','u_1g1n0l5y252k154z31243y','69530c23fcae28eecc8719719c4c6e6ce0b6785dcf2b3be4450e6be254c51b35','2026-07-15T10:55:23.616Z','2026-06-21T12:41:43.587Z',NULL,NULL,'2026-06-15 10:55:23');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_234r2i694k520s0m4b1h5w','u_1g1n0l5y252k154z31243y','dfc26d3f8e88f5dc429073c14518df1cf66044d26f37a79964b39b08a10fadc2','2026-07-21T12:41:43.675Z','2026-06-21T13:37:53.634Z',NULL,NULL,'2026-06-21 12:41:43');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6u304p1v1a0j664n29321u','u_1g1n0l5y252k154z31243y','62c7fd5fc0f6d358321540e640eb3a866fe7d5e077b686ebf56f28301c17708b','2026-07-21T13:37:53.942Z','2026-06-23T05:52:54.289Z',NULL,NULL,'2026-06-21 13:37:54');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5n3q1z5z1p5x112n540c6t','u_3q3p3i6y6u031l093u525h','7c9d0d7805c09bd52bc7d05d3aee92c8eed83d46b30ad6906c679dfb2f1d8ea1','2026-07-22T10:11:49.764Z','2026-06-22T10:12:13.865Z',NULL,NULL,'2026-06-22 10:11:49');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0x4b096u0a28272s1h4u6i','u_3g344c1940344h025u1502','b7164ab9483f8e920f7f4f521c9dc6618f927b37c0d2b4e1ea1736ce02c58730','2026-07-22T17:22:41.429Z',NULL,NULL,NULL,'2026-06-22 17:22:41');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5n20210t6j3i1i4642063z','u_admin','ba52e29d777b2a43a72826c6e665b406160d3be308179c2973eb121cf7d7432e','2026-07-23T04:53:12.319Z','2026-06-23T05:46:34.309Z',NULL,NULL,'2026-06-23 04:53:12');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_386o313v1u1u0s1n4p0t2g','u_admin','79653973dba35596e661b0cd12536854ba73d531e648d69a63781031859b520f','2026-07-23T04:53:58.158Z',NULL,NULL,NULL,'2026-06-23 04:53:58');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4i5e551n604l4u1w6o134e','u_admin','3e5b8eb0f4054b617b4ba3595b7163a9ee9c68bab6291f1877fe006ced35dfba','2026-07-23T05:46:34.613Z',NULL,NULL,NULL,'2026-06-23 05:46:34');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0f294e1g6r1f1l5t6x3u1j','u_1g1n0l5y252k154z31243y','b9aae0503a8779c8f1eb8899fba73d8a308646704498285bfb085b3916f6fe4d','2026-07-23T05:52:54.619Z','2026-06-23T11:26:25.588Z',NULL,NULL,'2026-06-23 05:52:54');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_18235260190w195u0k4y46','u_1g1n0l5y252k154z31243y','be8b643d292e94eaff4076e40b9087919e3c966aa0ba5ab4dd0b52a4c620b5d9','2026-07-23T11:26:25.674Z','2026-06-23T11:26:37.896Z',NULL,NULL,'2026-06-23 11:26:25');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_646r2x1g3i0j5g6i23471j','u_3q3p3i6y6u031l093u525h','47930e48185d8edc34af72ebc94f521600ebbb527dabd332cc32bc961e3ed1dd','2026-07-23T12:50:37.738Z','2026-06-23T12:50:42.008Z',NULL,NULL,'2026-06-23 12:50:37');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_500r4a2l4j4m385s226x2z','u_admin','53e01323a879fc49873dd0a0f56baf336dd2a000445a32a91563eb1d366af222','2026-07-26T11:24:53.442Z','2026-06-26T11:25:02.051Z',NULL,NULL,'2026-06-26 11:24:53');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_26701c5c233s3q3r1u0e5r','u_3q3p3i6y6u031l093u525h','9d351b587018199d83b63b4f5625dc15b7703b036be397b267ed7e0c967a5eeb','2026-07-26T11:25:14.554Z','2026-06-26T11:25:20.850Z',NULL,NULL,'2026-06-26 11:25:14');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6p0y2v41735f205y5p3h5y','u_3q3p3i6y6u031l093u525h','5f05a8e5454f0a64c229cba736e0c6d7a54e2394b386087bd6d71c86b3a47da4','2026-07-26T11:25:57.610Z',NULL,NULL,NULL,'2026-06-26 11:25:57');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_454f691y380u35154y1w05','u_3q3p3i6y6u031l093u525h','3489601f117b3f74b1ac9ffaecc6e0f75b7c7a0c5d13b5a0b98ed1785b95791c','2026-07-27T08:16:19.444Z','2026-06-27T09:02:46.494Z',NULL,NULL,'2026-06-27 08:16:19');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4u4u6600175k0w703f5s5s','u_3q3p3i6y6u031l093u525h','663a599792def5fe6e7ed0876d2e30431a61f3593a0dffc6f92ad24b324552f6','2026-07-27T09:02:46.566Z','2026-06-29T11:21:27.229Z',NULL,NULL,'2026-06-27 09:02:46');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3r2t6w5s1h2b6z2y2d5x65','u_3q3p3i6y6u031l093u525h','8083560ebcf051673f0cd9044651668e6f543e060ffea1c0d08cbb4616149fa7','2026-07-29T11:21:27.299Z','2026-06-29T11:21:30.427Z',NULL,NULL,'2026-06-29 11:21:27');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4b3n4c3j59036002251g69','u_partner','56f4cfedd5fc1701a465432cb283f9851446a0e6b6d6a74f532bbdd574dd2817','2026-07-29T11:22:31.254Z','2026-06-29T11:26:48.479Z',NULL,NULL,'2026-06-29 11:22:31');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_4t48401q333n5v2n673c6v','u_1a5k1o5l276q4b4z6w6z3s','e3ab7b1fdd449821a90e56eea293b261d5e60e94a8ba41f4a169191354b82886','2026-07-29T11:34:02.105Z',NULL,NULL,NULL,'2026-06-29 11:34:02');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_251i2m5m2r274k5l5r4i5m','u_1a5k1o5l276q4b4z6w6z3s','35a4b581c8071f9edb0b3430e9833a58b77e3d14a46f2a611bc24cc6c7181559','2026-07-29T11:34:27.081Z','2026-06-29T11:53:46.838Z',NULL,NULL,'2026-06-29 11:34:27');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2r6o5t30331y4v6j57635a','u_1a5k1o5l276q4b4z6w6z3s','2ab2b99f3f6fd3c7126d3f526f165e7697fffac2872d84abc9e67570b4be842c','2026-07-29T11:53:47.134Z','2026-06-30T06:44:34.283Z',NULL,NULL,'2026-06-29 11:53:47');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6t3e2b586x1v6t0a395i42','u_partner','cf9a5f59358a4b7ee4a6daaff05527b19b7fa72eb82e983d6a27c9eeede1e0e9','2026-07-30T06:43:43.441Z','2026-06-30T09:13:46.567Z',NULL,NULL,'2026-06-30 06:43:43');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6r53040s5l0h3v1y2s2h6y','u_1a5k1o5l276q4b4z6w6z3s','30ac4b9778ab18e6e43b49fb0d08b66f35e0b9faae15ea851bb06057ea51f076','2026-07-30T06:44:34.425Z','2026-07-03T06:04:00.051Z',NULL,NULL,'2026-06-30 06:44:34');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_476456014k2d5k0c264s4k','u_partner','4583736064eafa0bffea55aefc3a162f91e2f239bd585a62161b9384e4b5275d','2026-07-30T09:13:46.908Z','2026-07-01T10:43:00.639Z',NULL,NULL,'2026-06-30 09:13:47');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0o1c3545076x191l0f5a2v','u_partner','8b39d698dddd39ec60de56365a30f3cf306eb18428d14d4076eecd21769898cc','2026-07-31T10:43:00.934Z','2026-07-02T06:51:40.306Z',NULL,NULL,'2026-07-01 10:43:00');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_211o4y4j020q604l4g1f6y','u_partner','39427401a2b8759384865ab728838204e3f952606acd769474b25b2b72f58fa4','2026-08-01T06:51:40.591Z','2026-07-02T09:05:58.948Z',NULL,NULL,'2026-07-02 06:51:40');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2c1u4r2b136h382c1z301b','u_partner','e788b9d37e41a03e660a9860ddf1b9a83caa13109ffc1cbda9f7ae334f927d03','2026-08-01T09:05:59.253Z','2026-07-03T10:51:33.598Z',NULL,NULL,'2026-07-02 09:05:59');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_6d3333201q122d6t5e0z5z','u_0z6770296v582l1l4i3q38','e767f425d2cbedb79611ca60234058e3c3d8f1302837bdc6df26a6b0cb14f378','2026-08-02T05:27:20.168Z','2026-07-03T05:45:24.006Z',NULL,NULL,'2026-07-03 05:27:20');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2v2t366c1n3n1j5n730d2l','u_0z6770296v582l1l4i3q38','0ce6fa1d4c18fc10ed1764f593f05f80b176bfe5455baa88c488a3fc9ed2cdac','2026-08-02T05:45:24.316Z','2026-07-04T14:02:51.159Z',NULL,NULL,'2026-07-03 05:45:24');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_325s0a0u6k0c4i086z5m3c','u_1a5k1o5l276q4b4z6w6z3s','ef3712a1b9c462e6795c706c71f101e28cde167aa132c29377cf1b04dd8f11ed','2026-08-02T06:04:00.362Z','2026-07-04T13:46:49.489Z',NULL,NULL,'2026-07-03 06:04:00');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_622n333f0k6m2r1u4l1r02','u_partner','a245ba9dede41de56199dbee3a7468d6ec5d4023b04f002898bf1babf046047e','2026-08-02T10:51:33.680Z','2026-07-07T02:49:29.284Z',NULL,NULL,'2026-07-03 10:51:33');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5p55113v3e050a06302j3m','u_1a5k1o5l276q4b4z6w6z3s','fd05b7559af70e93dfd5fb1f2040c61c643c96865ce99829f22a3b732b3dce79','2026-08-03T13:46:49.598Z','2026-07-04T13:47:05.851Z',NULL,NULL,'2026-07-04 13:46:49');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_7060306j3y6b596v623p6h','u_3q3p3i6y6u031l093u525h','1a1ebc6385f778d389d3e227c03d9cceef82836e30f2c9e5286626a809bba1d1','2026-08-03T13:47:15.644Z','2026-07-07T07:17:34.589Z',NULL,NULL,'2026-07-04 13:47:15');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5p6u3w6z2w1y542v2i630j','u_0z6770296v582l1l4i3q38','5b875fe7c9e09bc0f4c29a910e156ea9d4d4de556110c497457610a812326dfd','2026-08-03T14:02:51.466Z','2026-07-05T14:42:42.670Z',NULL,NULL,'2026-07-04 14:02:51');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3r3s5k3k3l5s213d350i3g','u_0z6770296v582l1l4i3q38','794296e911053539fc414db1f2f5f0cca06fbc96227cebc82781256b3ebe4664','2026-08-04T14:42:42.951Z','2026-07-05T16:03:07.949Z',NULL,NULL,'2026-07-05 14:42:42');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0z4m5p1x69305f1o13221z','u_0z6770296v582l1l4i3q38','46cd4459f7f8fcd7479e6e7c0d0cc97ff59d59d92c287590b0263bdb60b11cdd','2026-08-04T16:03:08.249Z','2026-07-05T16:03:40.873Z',NULL,NULL,'2026-07-05 16:03:08');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_1v2b3s200j5y4a4g1i505n','u_partner','21e916f4a559e89fa1723c7db4399d66cfa65c333f67df54706f863857802178','2026-08-06T02:49:29.592Z','2026-07-16T07:31:17.335Z',NULL,NULL,'2026-07-07 02:49:29');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_060p6r130l1b575y35450l','u_3q3p3i6y6u031l093u525h','40102f84e01e3a48b36abe562e8615e9014dabb34363c5fd914b1f8cc8a36b31','2026-08-06T07:17:34.938Z','2026-07-07T07:17:37.076Z',NULL,NULL,'2026-07-07 07:17:35');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_116v0l3v5c6d1q1h3f5e3j','u_partner','ee89e5e2ca887f690618596c98847e2aabe478ff6411f257d5f10f451b9a1860','2026-08-15T07:31:17.664Z','2026-07-21T08:00:46.444Z',NULL,NULL,'2026-07-16 07:31:17');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2r4l6h4v1a1d365d492e5j','u_3q3p3i6y6u031l093u525h','b2397e90cd5a72c55f239579e0fe742386da853b7f09bdab82559ab6a488373d','2026-08-19T08:51:21.880Z','2026-07-21T08:00:47.618Z',NULL,NULL,'2026-07-20 08:51:22');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_11144j3j0q3t3k6d075w68','u_partner','3dd4914fe30e69c3d68c63e02861b970f47161ad01935ebaf608e4de449b39c5','2026-08-20T08:00:46.747Z','2026-07-21T16:37:50.530Z',NULL,NULL,'2026-07-21 08:00:46');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_156c1n3g166s060s4g391i','u_3q3p3i6y6u031l093u525h','72ab7d52392b944e84727705cd1e1aaa83d31a793011a57ff1d83e55c098d3fa','2026-08-20T08:00:47.772Z','2026-07-27T13:22:07.123Z',NULL,NULL,'2026-07-21 08:00:47');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_1k4h6w6u2r3h52084o0z58','u_partner','6cf077fbaa1bd0bf79994bc84694bde95c38a92845ed1dd72ced4505101f2c8b','2026-08-20T16:37:50.837Z','2026-07-27T13:21:40.712Z',NULL,NULL,'2026-07-21 16:37:50');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0k3l5h3f3j3m3e3b4s3q6c','u_0u430q685i5i33554h4w62','1e126a4a337fabef98a4835a11f114f23d2f68350fd1301e36c2ccf0f97ee352','2026-08-21T12:34:05.017Z',NULL,NULL,NULL,'2026-07-22 12:34:05');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_305y2r1c6h3h384v4y4v6p','u_0u430q685i5i33554h4w62','d886dfdefe0d946e9ffdf9adbddd43d876a903660dbf6c4112c2a1e1980a4f5f','2026-08-21T12:35:49.063Z','2026-07-25T07:20:54.519Z',NULL,NULL,'2026-07-22 12:35:49');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_243s1a2p655r003f1p6m3e','u_0u430q685i5i33554h4w62','6c220527786c8b1255e13b4376a8e6dd56f8b89dbe576cd24c3caa3e082e187b','2026-08-24T07:20:54.849Z',NULL,NULL,NULL,'2026-07-25 07:20:54');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_372n51655w2r0k6h0r3m21','u_partner','e7aed0c2244ac9d61a726df1508187fb7b5d6703587eb6559d46fee6f9dd560e','2026-08-26T13:21:41.036Z','2026-07-29T08:07:10.025Z',NULL,NULL,'2026-07-27 13:21:41');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2z5e3l2k2a404p5c5g5220','u_3q3p3i6y6u031l093u525h','d3e19af3c4c06b9b502310057341f95b8a9b35489e5ff0c671006cf77bff38b4','2026-08-26T13:22:08.067Z','2026-07-29T05:52:03.834Z',NULL,NULL,'2026-07-27 13:22:08');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_0l6b385l5r6s1z685t4w4i','u_3q3p3i6y6u031l093u525h','80fa6475bee62607053fca176cfca495d3e4fb8cc0e235c39f3ac485c6e3045c','2026-08-28T05:52:04.144Z','2026-07-29T05:52:06.032Z',NULL,NULL,'2026-07-29 05:52:04');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3i554y0u711v2o3z582r09','u_partner','6c61d375ae8f30c4e3b2fc2db73fe1892288bbe7714f43609c569daed6b4189c','2026-08-28T05:53:39.626Z','2026-07-29T05:53:58.263Z',NULL,NULL,'2026-07-29 05:53:39');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3z323h6b3q1d730g6z0y5r','u_partner','d635a91675cb2e769190a87302ee35dc5098c7ec3796271b459e0a3104ade556','2026-08-28T05:56:18.973Z','2026-07-29T05:59:21.332Z',NULL,NULL,'2026-07-29 05:56:19');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_3q310q5e1g2e5x4s573c4o','u_4s03112f3x5t4q6g254p6h','e65a78c97b6008416d05bb6d60922995dbafd3430a2e346e88b5a08fe9f98378','2026-08-28T07:54:29.452Z',NULL,NULL,NULL,'2026-07-29 07:54:29');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_074u376g3i3x5w1f4l5y00','u_5x3w6b4058041k2g4a182c','64f6e6eabf6729f7251031c38f1f14fa1ae94449f045cad8b5d9c7e0c811f220','2026-08-28T07:54:50.918Z',NULL,NULL,NULL,'2026-07-29 07:54:51');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_2d4a2t3y5v5f3o0z3a3e4r','u_01602z2n6e6h551c1w2j6d','dcc621af967d43b5f984a1dcfa3b7a2f3e72304e20d0e2ec303139a10b358cd3','2026-08-28T08:01:29.312Z',NULL,NULL,NULL,'2026-07-29 08:01:29');
INSERT INTO "refresh_tokens" ("id","user_id","token_hash","expires_at","revoked_at","user_agent","ip","created_at") VALUES('rt_5y6m68663z3p080t0d040z','u_partner','be0646faa323444e296afd48917200d28771f19dd3eb9e3e399167d666b0c5ae','2026-08-28T08:07:10.346Z',NULL,NULL,NULL,'2026-07-29 08:07:10');
CREATE TABLE otp_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  destination TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_6p5j656x5e5f2p0o736l2y',NULL,'mobile','+918830549719','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-06-29T11:31:56.012Z',NULL,0,'2026-06-29 11:26:56');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3j500m4v4w4d1l3g28575z',NULL,'mobile','+918830549719','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-06-29T11:33:45.837Z','2026-06-29T11:28:50.455Z',1,'2026-06-29 11:28:45');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3n6r713q6c1j3a291o043w',NULL,'email','jayeshprofessionals@gmail.com','f878224976f302ee621a955d3c72689a66e030c4ff7a9627e6602d7c7454099e','partner-onboarding','2026-06-29T11:33:50.733Z','2026-06-29T11:29:26.134Z',1,'2026-06-29 11:28:50');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_1z3t371p220e283v26384k',NULL,'mobile','+918830549719','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-06-29T11:36:59.695Z','2026-06-29T11:32:05.568Z',1,'2026-06-29 11:31:59');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_455v29736m4m0h5x220a5f',NULL,'email','jayeshprofessionals+2@gmail.com','df636e935e646677da11754c49b6c512584a50aeaa8188aa05cfa0448cbae8ba','partner-onboarding','2026-06-29T11:37:06.008Z','2026-06-29T11:32:32.335Z',1,'2026-06-29 11:32:06');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_464j0j2t0n73323q20291w',NULL,'mobile','+919820553547','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-06-30T06:44:35.905Z','2026-06-30T06:40:38.988Z',1,'2026-06-30 06:39:35');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_0z4r65420p2s1z111v730z',NULL,'email','maheshmehta79@gmail.com','507b250e2df714c703c1230b9a43295b88cfd9c11ab9530dc494af8517540110','partner-onboarding','2026-06-30T06:45:39.235Z',NULL,2,'2026-06-30 06:40:39');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_1r102p5o475w0f0p5i5w1e',NULL,'email','maheshmehta79@gmail.com','bfa7186fc2a7f44714380fd986f327be19ce00279512bd14399eba7eadbd9332','partner-onboarding','2026-06-30T06:46:17.324Z','2026-06-30T06:42:21.554Z',2,'2026-06-30 06:41:17');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_5p2c46133i6l4f66403d27',NULL,'mobile','+919820553547','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-02T09:11:25.268Z','2026-07-02T09:06:37.374Z',2,'2026-07-02 09:06:25');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_51045z1g4e512m054a4g13',NULL,'email','maheshmehta79@gmail.com','fa8e72acc148fb5778f6ca2096f54c947eedfd17e1e4ecf10948099a054bf4ac','partner-onboarding','2026-07-02T09:11:37.624Z',NULL,2,'2026-07-02 09:06:37');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_203u1a5a4264141d4u4t20',NULL,'email','maheshmehta79@gmail.com','0bccc6b5cf13b24dd799bb6a7f651a77bcc5af715a81df73079260b12c4cdfdf','partner-onboarding','2026-07-02T09:12:18.009Z',NULL,0,'2026-07-02 09:07:18');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_4e3n0w3d496d2w4w6f4168',NULL,'email','maheshmehta79@gmail.com','ddc5e87816df4a86e852f2598b4b6d58f8451e700f043cdcf4bc9058e2ca34df','partner-onboarding','2026-07-02T09:12:50.794Z',NULL,1,'2026-07-02 09:07:50');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_0z4752596m2c3z2w0q4933',NULL,'email','maheshmehta79@gmail.com','0ed1ed65b3eced01ffd0cf196a1b62afe72bf693085f786feac936a72e88ff17','partner-onboarding','2026-07-02T09:14:12.567Z',NULL,1,'2026-07-02 09:09:12');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_5w0r1h3o263y195o595x3e',NULL,'email','maheshmehta79@gmail.com','5dc25b5b0685cf11882a5e1f8fac8f065f94323bd28c05d8b28ef3c8f1e8cdc5','partner-onboarding','2026-07-02T09:15:31.844Z',NULL,0,'2026-07-02 09:10:31');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_0i6d5y6p010x2m3j5o313z',NULL,'email','maheshmehta79@gmail.com','489f8a5682b4786d979c1b0eed850102d31708bbacaa5d74bcd36791f1f24776','partner-onboarding','2026-07-02T09:17:08.594Z','2026-07-02T09:12:25.991Z',1,'2026-07-02 09:12:09');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3y4r1u72436k2u02061w6n',NULL,'mobile','+918889354535','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-03T03:39:32.135Z',NULL,0,'2026-07-03 03:34:32');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_5h65125w3r712u5h6j115c',NULL,'mobile','+918889354535','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-03T05:02:09.884Z','2026-07-03T04:57:24.924Z',1,'2026-07-03 04:57:09');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_1i3q510y5613455d5v064p',NULL,'email','av457508@gmail.com','4f67297d191c1d8d1a049777e2e78bf455cf620faa9664f156ffc0d13c34dcb0','partner-onboarding','2026-07-03T05:02:25.340Z','2026-07-03T04:58:53.946Z',3,'2026-07-03 04:57:25');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_5z1s583h3i07144n0q335n',NULL,'mobile','+918830549745','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-03T06:09:22.655Z','2026-07-03T06:04:27.594Z',1,'2026-07-03 06:04:22');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3t1t636y2f634130292k63',NULL,'email','jayeshprofessionals@gmail.com','06467d825dcf8f290facf5e25a110353ed09fc559655cdb338900e1f141f6e30','partner-onboarding','2026-07-03T06:09:27.966Z',NULL,0,'2026-07-03 06:04:28');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3m6x29012f6o716s681n55',NULL,'mobile','+918830549717','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-03T06:10:14.182Z','2026-07-03T06:05:18.860Z',1,'2026-07-03 06:05:14');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_1i6l404z3d6x4o0x2i3t6b',NULL,'email','jayeshprofessionals+91@gmail.com','d4a978462623f7fb422176e351c43106066cc8fc72887c11621b6970105eec8b','partner-onboarding','2026-07-03T06:10:19.086Z',NULL,0,'2026-07-03 06:05:19');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_4e0x6w0b452o3g6j3d652f',NULL,'mobile','+918889354538','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-06T01:13:00.418Z',NULL,1,'2026-07-06 01:08:00');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_6e0g4s2o1x6l4s1g3h4m6y',NULL,'mobile','+917247699493','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-06T01:22:55.092Z','2026-07-06T01:18:03.421Z',1,'2026-07-06 01:17:55');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_4t376j6l25196l3t34253f',NULL,'email','dv281888@gmail.com','b7ab14dc038ba44f5687eefe1c2361c65b6e07564db66ff0a76e31327be0cded','partner-onboarding','2026-07-06T01:23:03.894Z',NULL,0,'2026-07-06 01:18:03');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_2g0873125u0c075t4p6b3f',NULL,'mobile','+918889351604','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-06T01:24:25.277Z',NULL,0,'2026-07-06 01:19:25');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_646s2p713s275k1b0j6j59',NULL,'mobile','+918889351604','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-06T01:24:46.665Z','2026-07-06T01:19:49.290Z',1,'2026-07-06 01:19:46');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_5u5v0e6j0w706y392t2u1o',NULL,'email','pv457508@gmail.com','a317939822890c6ce0c7b0522f7403ca1e36a17b1f4acf66f4c6454427fefbf5','partner-onboarding','2026-07-06T01:24:49.521Z',NULL,2,'2026-07-06 01:19:49');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3k631i4n1a074y5i3l4m0w',NULL,'mobile','+918830549741','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-07T07:22:44.923Z','2026-07-07T07:17:49.949Z',1,'2026-07-07 07:17:45');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_0008294v5q0e2x3v5t5100',NULL,'email','jayeshprofessionals@gmail.com','1277a7dd951cfc873ca316a1a011069b0ed85a3f38100d9e73fd4f7c3e8e56b9','partner-onboarding','2026-07-07T07:22:50.250Z','2026-07-07T07:18:11.612Z',1,'2026-07-07 07:17:50');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_6a3e1q133c0d103473461g',NULL,'mobile','5383835865','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','partner-onboarding','2026-07-22T12:37:25.578Z','2026-07-22T12:32:39.518Z',2,'2026-07-22 12:32:25');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_1i1s4x0v6l281v3j5g5n6u',NULL,'email','pv457508@gmail.com','0a10e30bfe58c0ffed46034aae3f3d7809b091b6a934b72c0d7451818eb00de4','partner-onboarding','2026-07-22T12:37:40.234Z','2026-07-22T12:33:18.617Z',1,'2026-07-22 12:32:40');
INSERT INTO "otp_codes" ("id","user_id","channel","destination","code_hash","purpose","expires_at","consumed_at","attempts","created_at") VALUES('otp_3y70410e4g160j3v47044e','u_0u430q685i5i33554h4w62','email','pv457508@gmail.com','f377e3d02e0f11f0bbc009e569c26f170b5159a72f27cc466277f74ebba3a236','reset','2026-07-22T12:44:48.793Z','2026-07-22T12:35:35.950Z',1,'2026-07-22 12:34:48');
CREATE TABLE customer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT, last_name TEXT, dob TEXT, gender TEXT,
  city TEXT, state TEXT, pincode TEXT,
  pan_last4 TEXT, aadhaar_last4 TEXT,
  employment_type TEXT CHECK (employment_type IN ('SALARIED','SELF_EMPLOYED','BUSINESS','FREELANCER','UNEMPLOYED','STUDENT')),
  monthly_income_paise INTEGER,
  employer_name TEXT,
  cibil_range TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_demo','u_customer','Demo','Customer',NULL,NULL,'Mumbai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_6j6i5v5d064b00174y1r5z','u_3q3p3i6y6u031l093u525h','Jayesh','Mistry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 11:30:56','2026-06-01 11:30:56',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_2p3i405h6d2t3r1c4w3r13','u_1g1n0l5y252k154z31243y','Mahesh','Mehta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-01 17:13:58','2026-06-01 17:13:58',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_0o6m0f616v1i1z501g3769','u_3g344c1940344h025u1502','Aniket','Sinha',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-22 17:22:41','2026-06-22 17:22:41',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_05536k0n2r5i7100354s1x','u_4s03112f3x5t4q6g254p6h','Test','User',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-29 07:54:29','2026-07-29 07:54:29',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_5l6m3t5k5n0c3o4g120y1f','u_5x3w6b4058041k2g4a182c','Test','User',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-29 07:54:50','2026-07-29 07:54:50',NULL,NULL,NULL);
INSERT INTO "customer_profiles" ("id","user_id","first_name","last_name","dob","gender","city","state","pincode","pan_last4","aadhaar_last4","employment_type","monthly_income_paise","employer_name","cibil_range","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('cp_1i435g631e1b1s0y3w5b5x','u_01602z2n6e6h551c1w2j6d','Test','User',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-29 08:01:29','2026-07-29 08:01:29',NULL,NULL,NULL);
CREATE TABLE partner_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_person TEXT, city TEXT, state TEXT, pincode TEXT,
  gst_number TEXT, pan_last4 TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING','VERIFIED','REJECTED')),
  parent_partner_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
, `partner_code` text NOT NULL DEFAULT '', `email` text, `mobile` text, `address` text, `pan_number` text, `aadhaar_last4` text, `bank_account_json` text, `tier` text DEFAULT 'BRONZE' NOT NULL, `onboarding_step` text DEFAULT 'CONTACT' NOT NULL, `mobile_verified_at` text, `email_verified_at` text, `agreement_signed_at` text, `activated_at` text, `dob` text, `gender` text);
INSERT INTO "partner_profiles" ("id","user_id","business_name","contact_person","city","state","pincode","gst_number","pan_last4","kyc_status","parent_partner_id","created_at","updated_at","deleted_at","created_by","updated_by","partner_code","email","mobile","address","pan_number","aadhaar_last4","bank_account_json","tier","onboarding_step","mobile_verified_at","email_verified_at","agreement_signed_at","activated_at","dob","gender") VALUES('pp_demo','u_partner','Demo Partner LLP','Demo Partner','Mumbai','Maharashtra','400001','27AAAAA1111A1Z1','1234','VERIFIED',NULL,'2026-06-29 11:24:58','2026-06-29 11:24:58',NULL,NULL,NULL,'CRD-PA00001','partner@credupe.local','9876543210','123 Business Hub, BKC','ABCDE1234F','5678','{"bankName":"HDFC Bank Ltd","accountHolder":"Demo Partner LLP","accountNumber":"50200012345678","ifsc":"HDFC0000123"}','GOLD','COMPLETE','2026-06-20T10:00:00Z','2026-06-20T10:05:00Z','2026-06-20T10:10:00Z','2026-06-20T10:15:00Z',NULL,NULL);
INSERT INTO "partner_profiles" ("id","user_id","business_name","contact_person","city","state","pincode","gst_number","pan_last4","kyc_status","parent_partner_id","created_at","updated_at","deleted_at","created_by","updated_by","partner_code","email","mobile","address","pan_number","aadhaar_last4","bank_account_json","tier","onboarding_step","mobile_verified_at","email_verified_at","agreement_signed_at","activated_at","dob","gender") VALUES('pp_3q4q2l2b2v5w1s1c6w144n','u_1a5k1o5l276q4b4z6w6z3s','ABC firm','Jayesh Mistry','Mumbai','Maharashtra','60601','29ABCDE1234F1Z5','234F','PENDING',NULL,'2026-06-29 11:34:01','2026-06-29 11:34:01',NULL,NULL,NULL,'CRD-PA00002','jayeshprofessionals+2@gmail.com','+918830549719','101 Ocean Blvd','ABCDE1234F',NULL,'{"accountHolder":"ABC firm","accountNumber":"123456789012","ifsc":"HDFC0001234","bankName":"SBI bank"}','BRONZE','COMPLETE','2026-06-29T11:34:01.565Z','2026-06-29T11:34:01.565Z','2026-06-29T11:34:01.565Z','2026-06-29T11:34:01.565Z',NULL,NULL);
INSERT INTO "partner_profiles" ("id","user_id","business_name","contact_person","city","state","pincode","gst_number","pan_last4","kyc_status","parent_partner_id","created_at","updated_at","deleted_at","created_by","updated_by","partner_code","email","mobile","address","pan_number","aadhaar_last4","bank_account_json","tier","onboarding_step","mobile_verified_at","email_verified_at","agreement_signed_at","activated_at","dob","gender") VALUES('pp_0j6g3u5m2x29303q263z0i','u_0z6770296v582l1l4i3q38','fghgf','Amarjeet Verma','Chhindwara','c','480110','','234F','PENDING',NULL,'2026-07-03 05:27:19','2026-07-03 05:27:19',NULL,NULL,NULL,'CRD-PA00003','av457508@gmail.com','+918889354535',replace('Madhya Pradesh\nchhindwara','\n',char(10)),'ABCDE1234F',NULL,'{"accountHolder":"ghg","accountNumber":"76586787667879","ifsc":"HDFC0001234","bankName":"hgjh"}','BRONZE','COMPLETE','2026-07-03T05:27:19.523Z','2026-07-03T05:27:19.523Z','2026-07-03T05:27:19.523Z','2026-07-03T05:27:19.523Z',NULL,NULL);
INSERT INTO "partner_profiles" ("id","user_id","business_name","contact_person","city","state","pincode","gst_number","pan_last4","kyc_status","parent_partner_id","created_at","updated_at","deleted_at","created_by","updated_by","partner_code","email","mobile","address","pan_number","aadhaar_last4","bank_account_json","tier","onboarding_step","mobile_verified_at","email_verified_at","agreement_signed_at","activated_at","dob","gender") VALUES('pp_2a2v613s193j2l5h1r2y5y','u_0u430q685i5i33554h4w62','Sjsj','Ddjdj','Fdi','Ccjcj','480115','DDJD','234F','PENDING',NULL,'2026-07-22 12:34:05','2026-07-22 12:34:05',NULL,NULL,NULL,'CRD-PA00004','pv457508@gmail.com','5383835865','Dd','ABCDE1234F',NULL,'{"accountHolder":"Ccj","accountNumber":"8","ifsc":"DJDDJ","bankName":"Sdjj"}','BRONZE','BUSINESS_DETAILS','2026-07-22T12:34:04.899Z','2026-07-22T12:34:04.899Z','2026-07-22T12:34:04.899Z',NULL,NULL,NULL);
CREATE TABLE lenders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  integration_mode TEXT NOT NULL DEFAULT 'mock',
  webhook_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
INSERT INTO "lenders" ("id","name","slug","logo_url","active","integration_mode","webhook_url","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('l_hdfc','HDFC Bank','hdfc-bank',NULL,1,'mock',NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "lenders" ("id","name","slug","logo_url","active","integration_mode","webhook_url","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('l_icici','ICICI Bank','icici-bank',NULL,1,'mock',NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "lenders" ("id","name","slug","logo_url","active","integration_mode","webhook_url","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('l_sbi','State Bank of India','sbi',NULL,1,'mock',NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "lenders" ("id","name","slug","logo_url","active","integration_mode","webhook_url","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('l_axis','Axis Bank','axis-bank',NULL,1,'mock',NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "lenders" ("id","name","slug","logo_url","active","integration_mode","webhook_url","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('l_bajaj','Bajaj Finserv','bajaj-finserv',NULL,1,'mock',NULL,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
CREATE TABLE loan_products (
  id TEXT PRIMARY KEY,
  lender_id TEXT NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('PERSONAL_LOAN','HOME_LOAN','LOAN_AGAINST_PROPERTY','BUSINESS_LOAN','CAR_LOAN','USED_CAR_LOAN','TWO_WHEELER_LOAN','EDUCATION_LOAN','GOLD_LOAN','MICRO_LOAN','CREDIT_CARD')),
  version INTEGER NOT NULL DEFAULT 1,
  min_amount_paise INTEGER NOT NULL,
  max_amount_paise INTEGER NOT NULL,
  min_tenure_months INTEGER NOT NULL,
  max_tenure_months INTEGER NOT NULL,
  min_interest_rate_bps INTEGER NOT NULL,
  max_interest_rate_bps INTEGER NOT NULL,
  processing_fee_bps INTEGER,
  min_monthly_income_paise INTEGER,
  min_cibil_score INTEGER,
  allowed_cities_json TEXT NOT NULL DEFAULT '[]',
  allowed_states_json TEXT NOT NULL DEFAULT '[]',
  commission_bps INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_hdfc_pl','l_hdfc','HDFC Personal Loan','hdfc-personal-loan','PERSONAL_LOAN',1,5000000,400000000,12,60,1050,1799,200,2500000,700,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_icici_pl','l_icici','ICICI Personal Loan','icici-personal-loan','PERSONAL_LOAN',1,5000000,500000000,12,60,1075,1899,200,2500000,680,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_sbi_pl','l_sbi','SBI Personal Loan','sbi-personal-loan','PERSONAL_LOAN',1,5000000,200000000,12,72,1100,1499,150,2000000,650,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_axis_pl','l_axis','Axis Personal Loan','axis-personal-loan','PERSONAL_LOAN',1,5000000,400000000,12,60,1049,1799,200,2500000,700,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_bajaj_pl','l_bajaj','Bajaj Personal Loan','bajaj-personal-loan','PERSONAL_LOAN',1,5000000,350000000,12,84,1100,1999,250,2000000,685,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_hdfc_hl','l_hdfc','HDFC Home Loan','hdfc-home-loan','HOME_LOAN',1,100000000,5000000000,60,360,835,999,50,4000000,720,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_icici_hl','l_icici','ICICI Home Loan','icici-home-loan','HOME_LOAN',1,100000000,5000000000,60,360,850,999,50,4000000,720,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_sbi_hl','l_sbi','SBI Home Loan','sbi-home-loan','HOME_LOAN',1,100000000,4000000000,60,360,850,999,35,3500000,700,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_hdfc_bl','l_hdfc','HDFC Business Loan','hdfc-business-loan','BUSINESS_LOAN',1,20000000,500000000,12,60,1400,2199,250,5000000,700,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
INSERT INTO "loan_products" ("id","lender_id","name","slug","loan_type","version","min_amount_paise","max_amount_paise","min_tenure_months","max_tenure_months","min_interest_rate_bps","max_interest_rate_bps","processing_fee_bps","min_monthly_income_paise","min_cibil_score","allowed_cities_json","allowed_states_json","commission_bps","active","created_at","updated_at","deleted_at","created_by","updated_by") VALUES('p_bajaj_bl','l_bajaj','Bajaj Business Loan','bajaj-business-loan','BUSINESS_LOAN',1,20000000,800000000,12,60,1400,2299,300,4000000,685,'[]','[]',NULL,1,'2026-06-01 08:29:37','2026-06-01 08:29:37',NULL,NULL,NULL);
CREATE TABLE loan_applications (
  id TEXT PRIMARY KEY,
  reference_no TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  lender_id TEXT REFERENCES lenders(id) ON DELETE SET NULL,
  loan_type TEXT NOT NULL,
  amount_requested_paise INTEGER NOT NULL,
  tenure_months INTEGER NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'LEAD' CHECK (status IN ('LEAD','LOGIN','DOC_PENDING','UNDER_REVIEW','APPROVED','REJECTED','DISBURSED','CANCELLED')),
  form_data_json TEXT,
  rejection_reason TEXT,
  approved_amount_paise INTEGER,
  approved_tenure INTEGER,
  approved_rate_bps INTEGER,
  disbursed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
);
CREATE TABLE application_status_history (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_email TEXT,
  loan_type TEXT NOT NULL,
  amount_requested_paise INTEGER,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','QUALIFIED','APPLICATION_CREATED','DROPPED','CONVERTED')),
  notes TEXT,
  application_id TEXT UNIQUE REFERENCES loan_applications(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
, `reported_at` text);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('ld_1','pp_demo','u_partner','Rajesh Kumar','9811122233','rajesh@gmail.com','PERSONAL_LOAN',50000000,'p_hdfc_pl','Mumbai','CONVERTED','Approved and paid',NULL,'2026-06-29 11:25:53','2026-06-29 11:25:53',NULL,NULL,NULL,NULL);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('ld_2','pp_demo','u_partner','Anita Sharma','9811122244','anita@gmail.com','HOME_LOAN',300000000,'p_icici_hl','Mumbai','CONVERTED','Approved and paid',NULL,'2026-06-29 11:25:53','2026-06-29 11:25:53',NULL,NULL,NULL,NULL);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('ld_3','pp_demo','u_partner','Vikram Singh','9811122255','vikram@gmail.com','BUSINESS_LOAN',100000000,'p_hdfc_bl','Mumbai','APPLICATION_CREATED','Under review',NULL,'2026-06-29 11:25:53','2026-06-29 11:25:53',NULL,NULL,NULL,NULL);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('ld_4','pp_demo','u_partner','Pooja Patel','9811122266','pooja@gmail.com','PERSONAL_LOAN',25000000,'p_axis_pl','Mumbai','QUALIFIED','Interested, documents being collected',NULL,'2026-06-29 11:25:53','2026-06-29 11:25:53',NULL,NULL,NULL,NULL);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('lead_233m4q06113l550n0a0e4a','pp_3q4q2l2b2v5w1s1c6w144n','u_1a5k1o5l276q4b4z6w6z3s','Amarjeet Verma','0888935453','av457508@gmail.com','CREDIT_CARD',NULL,NULL,NULL,'NEW','Submitted via public Utility Tool. Partner Code: CRD-PA00002',NULL,'2026-07-20 11:38:28','2026-07-20 11:38:28',NULL,NULL,NULL,NULL);
INSERT INTO "leads" ("id","partner_id","created_by_id","customer_name","customer_mobile","customer_email","loan_type","amount_requested_paise","product_id","city","status","notes","application_id","created_at","updated_at","deleted_at","created_by","updated_by","reported_at") VALUES('lead_176y1x3w2q5x2q3o166e3i','pp_3q4q2l2b2v5w1s1c6w144n','u_1a5k1o5l276q4b4z6w6z3s','Amarjeet Verma','0888935453','av457508@gmail.com','CREDIT_CARD',NULL,NULL,NULL,'NEW','Submitted via public Utility Tool. Partner Code: CRD-PA00002',NULL,'2026-07-20 11:42:48','2026-07-20 11:42:48',NULL,NULL,NULL,NULL);
CREATE TABLE lead_follow_ups (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  note TEXT,
  done_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE commissions (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
  lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES loan_products(id) ON DELETE SET NULL,
  amount_paise INTEGER NOT NULL,
  payout_bps INTEGER,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','PAID','REVERSED')),
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "commissions" ("id","partner_id","lead_id","product_id","amount_paise","payout_bps","status","paid_at","created_at","updated_at") VALUES('c_1','pp_demo','ld_1','p_hdfc_pl',750000,150,'PAID','2026-06-28T10:00:00Z','2026-06-29 11:26:07','2026-06-29 11:26:07');
INSERT INTO "commissions" ("id","partner_id","lead_id","product_id","amount_paise","payout_bps","status","paid_at","created_at","updated_at") VALUES('c_2','pp_demo','ld_2','p_icici_hl',1500000,50,'PAID','2026-06-28T10:00:00Z','2026-06-29 11:26:07','2026-06-29 11:26:07');
INSERT INTO "commissions" ("id","partner_id","lead_id","product_id","amount_paise","payout_bps","status","paid_at","created_at","updated_at") VALUES('c_3','pp_demo','ld_3','p_hdfc_bl',1000000,100,'APPROVED',NULL,'2026-06-29 11:26:07','2026-06-29 11:26:07');
INSERT INTO "commissions" ("id","partner_id","lead_id","product_id","amount_paise","payout_bps","status","paid_at","created_at","updated_at") VALUES('c_4','pp_demo','ld_4','p_axis_pl',375000,150,'PENDING',NULL,'2026-06-29 11:26:07','2026-06-29 11:26:07');
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  application_id TEXT REFERENCES loan_applications(id) ON DELETE CASCADE,
  tag TEXT NOT NULL DEFAULT 'OTHER' CHECK (tag IN ('KYC','INCOME','PROPERTY','BANK_STATEMENT','OTHER')),
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  storage_key TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'UPLOADED' CHECK (status IN ('UPLOADED','VERIFIED','REJECTED')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT, created_by TEXT, updated_by TEXT
, `document_name` text);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_1','u_partner',NULL,'KYC','pan_card.pdf','application/pdf',1048576,'kyc/pp_demo/pan_card.pdf',1,'VERIFIED',NULL,'2026-06-29 11:26:17','2026-06-29 11:26:17',NULL,NULL,NULL,NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_2','u_partner',NULL,'KYC','gst_certificate.pdf','application/pdf',2097152,'kyc/pp_demo/gst_certificate.pdf',1,'VERIFIED',NULL,'2026-06-29 11:26:17','2026-06-29 11:26:17',NULL,NULL,NULL,NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_3','u_partner',NULL,'BANK_STATEMENT','cancelled_cheque.pdf','application/pdf',1572864,'kyc/pp_demo/cancelled_cheque.pdf',1,'VERIFIED',NULL,'2026-06-29 11:26:17','2026-06-29 11:26:17',NULL,NULL,NULL,NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_2v1e0s512s6i286a6z3y2s','u_1a5k1o5l276q4b4z6w6z3s',NULL,'KYC','invoice-360EC_NAV_2026_3411.pdf','application/pdf',69690,'kyc-temp/jayeshprofessionals+2@gmail.com/doc_2v1e0s512s6i286a6z3y2s/invoice-360EC_NAV_2026_3411.pdf',1,'UPLOADED',NULL,'2026-06-29 11:34:01','2026-06-29 11:34:01',NULL,'u_1a5k1o5l276q4b4z6w6z3s','u_1a5k1o5l276q4b4z6w6z3s',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_4u2x3z4t1c720r1k526u68','u_1a5k1o5l276q4b4z6w6z3s',NULL,'KYC','invoice-360EC_NAV_2026_3411.pdf','application/pdf',69690,'kyc-temp/jayeshprofessionals+2@gmail.com/doc_4u2x3z4t1c720r1k526u68/invoice-360EC_NAV_2026_3411.pdf',1,'UPLOADED',NULL,'2026-06-29 11:34:01','2026-06-29 11:34:01',NULL,'u_1a5k1o5l276q4b4z6w6z3s','u_1a5k1o5l276q4b4z6w6z3s',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_164j1q4s3n5s0e06710f59','u_1a5k1o5l276q4b4z6w6z3s',NULL,'KYC','invoice-360EC_NAV_2026_3411.pdf','application/pdf',69690,'kyc-temp/jayeshprofessionals+2@gmail.com/doc_164j1q4s3n5s0e06710f59/invoice-360EC_NAV_2026_3411.pdf',1,'UPLOADED',NULL,'2026-06-29 11:34:02','2026-06-29 11:34:02',NULL,'u_1a5k1o5l276q4b4z6w6z3s','u_1a5k1o5l276q4b4z6w6z3s',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_0i5b6b1q6l2d6l3e3l1a17','u_1a5k1o5l276q4b4z6w6z3s',NULL,'KYC','invoice-360EC_NAV_2026_4013.pdf','application/pdf',51457,'kyc-temp/jayeshprofessionals+2@gmail.com/doc_0i5b6b1q6l2d6l3e3l1a17/invoice-360EC_NAV_2026_4013.pdf',1,'UPLOADED',NULL,'2026-06-29 11:34:02','2026-06-29 11:34:02',NULL,'u_1a5k1o5l276q4b4z6w6z3s','u_1a5k1o5l276q4b4z6w6z3s',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_5l6d4v6b050k1d42412k2m','u_1a5k1o5l276q4b4z6w6z3s',NULL,'KYC','invoice-360EC_NAV_2026_3411.pdf','application/pdf',69690,'kyc-temp/jayeshprofessionals+2@gmail.com/doc_5l6d4v6b050k1d42412k2m/invoice-360EC_NAV_2026_3411.pdf',1,'UPLOADED',NULL,'2026-06-29 11:34:02','2026-06-29 11:34:02',NULL,'u_1a5k1o5l276q4b4z6w6z3s','u_1a5k1o5l276q4b4z6w6z3s',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_1f682i616i41610v2f2a0g','u_0z6770296v582l1l4i3q38',NULL,'KYC','Global_SMS_Provider_Pricing.pdf','application/pdf',2288,'kyc-temp/av457508@gmail.com/doc_1f682i616i41610v2f2a0g/Global_SMS_Provider_Pricing.pdf',1,'UPLOADED',NULL,'2026-07-03 05:27:19','2026-07-03 05:27:19',NULL,'u_0z6770296v582l1l4i3q38','u_0z6770296v582l1l4i3q38',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_2a5q2t2p2o1l69502h1e4r','u_0z6770296v582l1l4i3q38',NULL,'KYC','Global_SMS_Provider_Pricing.pdf','application/pdf',2288,'kyc-temp/av457508@gmail.com/doc_2a5q2t2p2o1l69502h1e4r/Global_SMS_Provider_Pricing.pdf',1,'UPLOADED',NULL,'2026-07-03 05:27:19','2026-07-03 05:27:19',NULL,'u_0z6770296v582l1l4i3q38','u_0z6770296v582l1l4i3q38',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_6z0y6p5r3c3x58002c0k1j','u_0z6770296v582l1l4i3q38',NULL,'KYC','Global_SMS_Provider_Pricing.pdf','application/pdf',2288,'kyc-temp/av457508@gmail.com/doc_6z0y6p5r3c3x58002c0k1j/Global_SMS_Provider_Pricing.pdf',1,'UPLOADED',NULL,'2026-07-03 05:27:20','2026-07-03 05:27:20',NULL,'u_0z6770296v582l1l4i3q38','u_0z6770296v582l1l4i3q38',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_714y0f2h3s023n0d661p2c','u_0z6770296v582l1l4i3q38',NULL,'KYC','Global_SMS_Provider_Pricing.pdf','application/pdf',2288,'kyc-temp/av457508@gmail.com/doc_714y0f2h3s023n0d661p2c/Global_SMS_Provider_Pricing.pdf',1,'UPLOADED',NULL,'2026-07-03 05:27:20','2026-07-03 05:27:20',NULL,'u_0z6770296v582l1l4i3q38','u_0z6770296v582l1l4i3q38',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_624b0z15073n1f2s4u2116','u_0z6770296v582l1l4i3q38',NULL,'KYC','Global_SMS_Provider_Pricing.pdf','application/pdf',2288,'kyc-temp/av457508@gmail.com/doc_624b0z15073n1f2s4u2116/Global_SMS_Provider_Pricing.pdf',1,'UPLOADED',NULL,'2026-07-03 05:27:20','2026-07-03 05:27:20',NULL,'u_0z6770296v582l1l4i3q38','u_0z6770296v582l1l4i3q38',NULL);
INSERT INTO "documents" ("id","owner_user_id","application_id","tag","file_name","mime_type","size_bytes","storage_key","version","status","rejection_reason","created_at","updated_at","deleted_at","created_by","updated_by","document_name") VALUES('doc_4q1r3s272i3x0a1o3g235n','u_01602z2n6e6h551c1w2j6d',NULL,'OTHER','test_document.txt','text/plain',94,'https://staging-api.credupe.com/api/v1/documents/download/doc_4q1r3s272i3x0a1o3g235n',1,'UPLOADED',NULL,'2026-07-29 08:01:33','2026-07-29 08:01:33',NULL,NULL,NULL,NULL);
CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL CHECK (channel IN ('IN_APP','EMAIL','SMS')),
  subject TEXT,
  body TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('IN_APP','EMAIL','SMS')),
  template_code TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENT','FAILED','READ')),
  read_at TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  loan_type TEXT NOT NULL,
  amount_paise INTEGER NOT NULL,
  tenure_months INTEGER NOT NULL,
  monthly_income_paise INTEGER,
  cibil_score INTEGER,
  city TEXT,
  state TEXT,
  offers_json TEXT NOT NULL DEFAULT '[]',
  share_slug TEXT UNIQUE,
  share_expires_at TEXT,
  full_name TEXT,
  mobile TEXT,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ui_configs (
  config TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideCarLoan',1,'2026-06-01 17:02:37','2026-06-26T11:26:10.770Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideGoldLoan',1,'2026-06-01 17:02:38','2026-06-26T11:26:09.884Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideUsedCarLoan',1,'2026-06-01 17:02:40','2026-07-04T13:47:20.614Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideBusinessLoans',1,'2026-06-01 17:02:41','2026-06-26T11:26:11.639Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideTwoWheelerLoan',1,'2026-06-01 17:02:42','2026-06-26T11:26:12.619Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideBankingEcosystem',1,'2026-06-01 17:02:44','2026-06-26T11:26:38.370Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsStats',0,'2026-06-01 17:02:44','2026-07-21T08:01:18.224Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsInvestors',0,'2026-06-01 17:02:45','2026-07-21T08:01:22.320Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsAdvisors',0,'2026-06-01 17:02:46','2026-07-21T08:01:17.369Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideWallOfWin',1,'2026-06-01 17:02:47','2026-06-26T11:26:37.170Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsCompanyStats',0,'2026-06-01 17:02:48','2026-07-21T08:01:18.384Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideStatsSection',1,'2026-06-01 17:02:49','2026-06-26T11:26:30.251Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hidePartnerStats',1,'2026-06-01 17:02:49','2026-06-26T11:26:28.411Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsFounders',0,'2026-06-01 17:02:51','2026-07-21T08:01:15.616Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAboutUsPress',0,'2026-06-01 17:02:51','2026-07-21T08:01:22.322Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideFooterCarLoan',1,'2026-06-01 17:02:52','2026-06-26T11:26:21.090Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideFooterGoldLoan',1,'2026-06-01 17:02:53','2026-06-26T11:26:21.570Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideFooterTwoWheelerLoan',1,'2026-06-01 17:02:54','2026-06-26T11:26:22.499Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideFooterBusinessLoan',1,'2026-06-01 17:02:55','2026-06-26T11:26:23.249Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideCareersSalaryPerk',1,'2026-06-02 12:14:35','2026-06-26T11:26:35.290Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductTwoWheelerLoan',1,'2026-06-02 12:14:35','2026-06-26T11:26:34.770Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductMicroLoan',1,'2026-06-02 12:14:36','2026-06-26T11:26:34.450Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductBusinessLoan',1,'2026-06-02 12:14:37','2026-06-26T11:26:33.968Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductUsedCarLoan',1,'2026-06-02 12:14:37','2026-06-26T11:26:33.250Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductCarLoan',1,'2026-06-02 12:14:39','2026-06-26T11:26:41.089Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideProductGoldLoan',1,'2026-06-02 12:14:40','2026-06-26T11:26:42.249Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideHomeLoan',1,'2026-07-04 13:47:22','2026-07-04T13:47:22.061Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideLoanAgainstProperty',1,'2026-07-04 13:47:23','2026-07-04T13:47:23.687Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideAllFooterLinks',0,'2026-07-04 13:47:44','2026-07-04T13:48:02.248Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideHeroCtas',1,'2026-07-04 13:47:44','2026-07-04T13:47:44.845Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideCreduAi',1,'2026-07-04 13:47:46','2026-07-04T13:47:46.037Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideCreditScoreForm',1,'2026-07-04 13:48:03','2026-07-04T13:48:03.184Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('navbar.hideCreditCard',1,'2026-07-20 08:51:25','2026-07-20T08:51:25.154Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideCreditCardSection',1,'2026-07-20 08:51:32','2026-07-20T08:51:32.752Z');
INSERT INTO "ui_configs" ("config","value","created_at","updated_at") VALUES('sections.hideFooterCreditCard',1,'2026-07-20 08:51:36','2026-07-20T08:51:36.213Z');
CREATE TABLE `commission_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`loan_type` text NOT NULL,
	`rule_type` text DEFAULT 'PERCENT' NOT NULL,
	`payout_bps` integer,
	`flat_amount_paise` integer,
	`min_amount_paise` integer,
	`max_amount_paise` integer,
	`notes` text,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "commission_rules" ("id","loan_type","rule_type","payout_bps","flat_amount_paise","min_amount_paise","max_amount_paise","notes","active","created_at","updated_at") VALUES('r_pl','PERSONAL_LOAN','PERCENT',150,NULL,NULL,NULL,'Standard personal loan rate (1.5%)',1,'2026-06-29 11:25:44','2026-06-29 11:25:44');
INSERT INTO "commission_rules" ("id","loan_type","rule_type","payout_bps","flat_amount_paise","min_amount_paise","max_amount_paise","notes","active","created_at","updated_at") VALUES('r_hl','HOME_LOAN','PERCENT',50,NULL,NULL,NULL,'Standard home loan rate (0.5%)',1,'2026-06-29 11:25:44','2026-06-29 11:25:44');
INSERT INTO "commission_rules" ("id","loan_type","rule_type","payout_bps","flat_amount_paise","min_amount_paise","max_amount_paise","notes","active","created_at","updated_at") VALUES('r_bl','BUSINESS_LOAN','PERCENT',100,NULL,NULL,NULL,'Standard business loan rate (1.0%)',1,'2026-06-29 11:25:44','2026-06-29 11:25:44');
INSERT INTO "commission_rules" ("id","loan_type","rule_type","payout_bps","flat_amount_paise","min_amount_paise","max_amount_paise","notes","active","created_at","updated_at") VALUES('r_el','EDUCATION_LOAN','PERCENT',125,NULL,NULL,NULL,'Standard education loan rate (1.25%)',1,'2026-06-29 11:25:44','2026-06-29 11:25:44');
CREATE TABLE `sms_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`provider` text NOT NULL,
	`status` text NOT NULL,
	`purpose` text NOT NULL,
	`message_id` text,
	`error` text,
	`response_time` integer,
	`cost` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `system_states` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `user_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`rating_label` text NOT NULL,
	`ip_address` text,
	`device` text,
	`platform` text,
	`app_version` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',9);
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_otp_dest_purpose ON otp_codes(destination, purpose);
CREATE INDEX idx_products_type_active ON loan_products(loan_type, active);
CREATE INDEX idx_apps_user_status ON loan_applications(user_id, status);
CREATE INDEX idx_apps_status ON loan_applications(status);
CREATE INDEX idx_ash_app ON application_status_history(application_id);
CREATE INDEX idx_leads_partner_status ON leads(partner_id, status);
CREATE INDEX idx_lfu_lead ON lead_follow_ups(lead_id);
CREATE INDEX idx_commissions_partner_status ON commissions(partner_id, status);
CREATE INDEX idx_docs_owner ON documents(owner_user_id);
CREATE INDEX idx_docs_app ON documents(application_id);
CREATE INDEX idx_notifs_user_status ON notifications(user_id, status);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE UNIQUE INDEX idx_quotes_slug ON quotes(share_slug);
CREATE UNIQUE INDEX `commission_rules_loan_type_unique` ON `commission_rules` (`loan_type`);
CREATE UNIQUE INDEX `partner_profiles_partner_code_unique` ON `partner_profiles` (`partner_code`);
CREATE INDEX `idx_sms_logs_phone` ON `sms_logs` (`phone`);
CREATE INDEX `idx_sms_logs_created` ON `sms_logs` (`created_at`);
CREATE INDEX `idx_user_feedback_user` ON `user_feedback` (`user_id`);
CREATE INDEX `idx_user_feedback_rating` ON `user_feedback` (`rating`);
