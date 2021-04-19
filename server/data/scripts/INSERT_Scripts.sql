-- @block Invoice Status Table Data
INSERT INTO invoice_statuses (id, status_name, description, createdAt, updatedAt)
VALUES 
    ( '1', 'Pending', 'We have not recieved payment from client and still waiting on it', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '2', 'Paid', 'Invoice has been fully paid and considered fulfilled', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '3', 'Outstanding', 'No payment has been recieved from the client and is past due.', '2021-04-15 05:00:25', '2021-04-15 05:00:25');

-- @BLOCK Estimate Status Table Data
INSERT INTO et_statuses (id, status_name, description, createdAt, updatedAt)
VALUES 
    ( '2', 'Approved', 'Estimate has been approved by the client and is ready to begin job.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '1', 'Pending', 'Estimate has been set in pending meaning waiting for client response on quoted price for job.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '3', 'Expired', 'Estimate has not recieved response back from the client and the quoted price will not be honered.', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
-- @block Job Type Table Data
INSERT INTO job_types (id, type_name, description, createdAt, updatedAt)
VALUES 
    ( '1', 'New Roof Installation', 'New Roof Installation,A new roof will be installed that includes labor and materials.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '2', 'Roofing Repairs', 'Anything that deals fixing roof problems from leaks to damages in the roof.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '3', 'Structure Construction', 'Building structures or other building work.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '4', 'Siding Repair', 'Repairing siding from indoors/outdoors.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '5', 'Roof Maintenance' , 'Service that includes that cleans the roof from leaves and other dirty causing issues.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '6', 'Painting Interior of Home' , 'Painting indoors for the client.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '7', 'Painting Exterior of Home' , 'Painting the outdoors for the client.', '2021-04-15 05:00:25', '2021-04-15 05:00:25' ),
    ( '8', 'Flooring Installation', 'Installing tile floors to wood floor.','2021-04-15 05:00:25', '2021-04-15 05:00:25');
-- @block Employee Status Table Data
INSERT INTO emp_statuses (id, status_name, description, createdAt, updatedAt)
VALUES
    ( '1', 'Active', 'Employee is currently working with the company.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '2', 'Hold', 'Employee is currently on hold due to personal reasons.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '3', 'Injured', 'Injured,employee is currently injured and is not able to work at this very monment in time.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '4', 'Vacation', 'Employee is currently taking time off.', '2021-04-15 05:00:25', '2021-04-15 05:00:25'),
    ( '5', 'Terminated', 'Employee has been fired from the company.', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
-- @block Customer Table Data
INSERT INTO customers VALUES('1' ,'Lion Friett','42 Bowman Plaza','Huntsville','Alabama','58539','812-680-3985','lfriett0@netlog.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('2' ,'Bernadene Broadbear','3446 Hudson Parkway','Topi','Alaska','58323','887-582-2296','bbroadbear1@goodreads.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('3' ,'Xenia Easby','535 Maple Crossing','Cullman','Arizona','23232','744-181-9741','xeasby2@dmoz.org','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('4' ,'Julianne Perree','62 Oak Valley Terrace','El Triunfo','Arkansas','45454','951-545-6390','jperree3@unicef.org','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('5' ,'Georgeanne Mousby','1 Swallow Street','Montomery','California','23454','394-129-1531','gmousby4@bravesites.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('6' ,'Dinnie Attle','2 Algoma Pass','Danauparis','Colorado','23453','824-696-5906','dattle5@elegantthemes.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('7' ,'Tyson Pipe','54 Sunnyside Road','Auburn ','Delware','34564','794-576-3953','tpipe6@ox.ac.uk','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('8' ,'Franzen Defty','32 Express Hill','Lyon','Connecticut','34256','805-628-7997','fdefty7@icq.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('9' ,'Freeman Murcutt','51154 Fulton Plaza','Ystad','New York','35436','258-202-9091','fmurcutt8@studiopress.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('10' ,'Ferrel Habin','44 Northview Park','Hoover','Michigan','49304','609-215-0897','fhabin9@mail.ru','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('11' ,'Kakalina Gheraldi','93 Westridge Junction','Randfontein','Nevada','44707','671-452-2305','kgheraldia@unesco.org','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('12' ,'Casie Skippen','36 Butternut Court','Madrid','Florida','23233','414-145-1824','cskippenb@samsung.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('13' ,'Nils Pendry','51 Graceland Pass','Gadsden','Utah','35643','193-646-0215','npendryc@google.es','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('14' ,'Emanuele Negal','1 Green Drive','El Paisnal','Aveiro','89844','832-411-8637','enegald@guardian.co.uk','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('15' ,'Ralina Kenward','8 Transport Center','Jeding','Texas','92305','745-577-7445','rkenwarde@timesonline.co.uk','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('16' ,'Constantin Occleshaw','698 Colorado Road','Akron','Maine','34354','330-484-1307','coccleshawf@spotify.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('17' ,'Juliann Bowdler','515 Jay Junction','Sidowayah Lor','Iowa','39483','753-906-1697','jbowdlerg@oracle.com','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('18' ,'Vernen Sodory','8192 Clyde Gallagher Crossing','Antipolo','Idaho','98854','610-377-4251','vsodoryh@drupal.org','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('19' ,'Cordy Welsh','7 Debs Parkway','Pelham','Hawaii','23735','138-508-8269','cwelshi@pagesperso-orange.fr','2021-04-15 05:00:25','2021-04-15 05:00:25');
INSERT INTO customers VALUES('20' ,'Ross Fricker','11894 Spenser Alley','Rengo','Missouri','11940','313-217-2529','rfrickerj@usa.gov','2021-04-15 05:00:25','2021-04-15 05:00:25');
-- @block Employee Table Data
INSERT INTO employees VALUES('1','4','Maury Cornock','00449 Corscot Pass','Kusheriki','AB','13844','United States','tedmeads0@bluehost.com','3875418453','16.99', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('2','3','Robbi Lambal','4 Ridge Oak Crossing','Sukaharja','IO','13297','United States','boddie1@printfriendly.com','1188843225','19.94', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('3','5','Oralle Richard','8 Nevada Avenue','Ban Mai','LV','11491','United States','mtunniclisse2@webmd.com','6428718228','14.05', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('4','4','See Bisatt','740 Saint Paul Drive','SkÃ³pelos','MI','11350','United States','gskellen3@washingtonpost.com','7905400496','16.62', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('5','3','Katharina Battershall','2 Lerdahl Avenue','Cruz del Eje','CA','13933','United States','asugars4@redcross.org','8053554582','16.84', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('6','1','Hattie Grundle','04665 Oneill Alley','Skokovi','PO','18690','United States','scornier5@reddit.com','6992765931','20.53', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('7','2','Isacco Sheircliffe','53108 Waubesa Crossing','Albergaria','WE','17264','United States','mstummeyer6@flavors.me','6910053683','12.9', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('8','5','Alphonso Shaplin','76 Morningstar Place','La Fortuna','KI','11446','United States','tvolleth7@tripadvisor.com','3347870165','22.71', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('9','3','Davidson Stapells','04940 Forest Dale Way','Priboj','WC','17661','United States','cshakelady8@toplist.cz','6470799661','17.57', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('10','4','Niel Seakin','6215 Troy Avenue','Delft','AL','15260','United States','ppreshaw9@ca.gov','1164134528','13.66', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('11','4','Melantha Rollason','57646 Loeprich Crossing','SremÄica','LA','12789','United States','ypickthalla@shutterfly.com','8181341591','20.48', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('12','5','Gilligan Klamman','74193 Service Way','Richmond','LX','16510','United States','bscranedgeb@auda.org.au','5979952918','19.82', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('13','3','Phylis Barford','62 Bowman Trail','Fresnes','AC','17604','United States','ccompfordc@wufoo.com','8782867855','24.4', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('14','5','Leeland Davidoff','73 Warrior Junction','Lesnoye','PC','13856','United States','drissond@unesco.org','2113785414','21.25', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('15','1','Elsworth Wyldbore','0415 Mesta Alley','Kleszczewo','KI','11401','United States','sbuzeke@cafepress.com','3845169873','14.47', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('16','3','Elvina Reddihough','181 Ridgeview Drive','Longkou','CH','17353','United States','aboarderf@independent.co.uk','5928129871','22.57', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('17','3','Theresita McDuffie','26232 Warrior Circle','Apatin','SE','17616','United States','rhumbyg@feedburner.com','9218741124','23.26', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('18','3','Traci McDade','8815 Crest Line Plaza','Kuasha','FI','13118','United States','agiraulth@toplist.cz','5374090279','13.32', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('19','3','Bibby Mc Gaughey','08758 Atwood Hill','Lappeenranta','GR','17783','United States','pharesigni@clickbank.net','8324323438','23.72', '2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO employees VALUES('20','4','Johna Siflet','450 Memorial Hill','Simajia','NI','18554','United States','jsallierej@yahoo.co.jp','7625209171','21.82', '2021-04-15 05:00:25', '2021-04-15 05:00:25');

-- @block Invoice Table Data
INSERT INTO invoices VALUES('1' ,'6','6','1','2021-04-15','2021-04-15','Interior Painting Service','459','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('2' ,'5','7','3','2021-04-15','2021-04-15','Exterior Painting Service','1990','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('3' ,'9','5','2','2021-04-15','2021-04-15','Roof Maintenance','610','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('4' ,'11','1','1','2021-04-15','2021-04-15','Roof replacement','2262','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('5' ,'1','2','1','2021-04-15','2021-04-15','Roof Repair','2004','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('6' ,'12','5','1','2021-04-15','2021-04-15','Inspection','2281','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('7' ,'4','5','1','2021-04-15','2021-04-15','Rood Cleaning','294','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('8' ,'13','5','2','2021-04-15','2021-04-15','Roof restoration','885','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('9' ,'8','2','3','2021-04-15','2021-04-15','Roof Tile repair','2415','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('10' ,'14','2','1','2021-04-15','2021-04-15','Roof valley repair','1870','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('11' ,'15','4','2','2021-04-15','2021-04-15','interior and exterior service','2018','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('12' ,'2','7','3','2021-04-15','2021-04-15','roof painting','2332','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('13' ,'18','5','3','2021-04-15','2021-04-15','Roof Maintenance','2279','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('14' ,'19','2','3','2021-04-15','2021-04-15','Roof Repair','689','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('15' ,'16','1','1','2021-04-15','2021-04-15','Inspection','2900','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('16' ,'7','1','1','2021-04-15','2021-04-15','Roof replacement','274','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('17' ,'20','1','1','2021-04-15','2021-04-15','Roof repair and replacement','300','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('18' ,'3','3','3','2021-04-15','2021-04-15','Building padio ','698','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('19' ,'10','2','1','2021-04-15','2021-04-15','Roof Tile repair','2385','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
INSERT INTO invoices VALUES('20' ,'17','5','1','2021-04-15','2021-04-15','Roof Maintenance','955','2021-04-15 05:00:25', '2021-04-15 05:00:25','1');
-- @block Estimate Table Data
INSERT INTO estimates VALUES('1' ,'1','1','2021-04-15','2021-04-15','47','Interior Service','730.62','892.99','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('2' ,'2','2','2021-04-15','2021-04-15','55','Exterior Service','269.85','453.29','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('3' ,'3','3','2021-04-15','2021-04-15','6','Roof Maintenance','167.71','235.33','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('4' ,'3','4','2021-04-15','2021-04-15','27','Roof replacement','513.89','502.36','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('5' ,'3','5','2021-04-15','2021-04-15','16','Roof Repair','118.46','780.13','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('6' ,'3','6','2021-04-15','2021-04-15','18','Inspection','466.33','972.39','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('7' ,'3','7','2021-04-15','2021-04-15','35','Rood Cleaning','281.52','159.12','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('8' ,'1','8','2021-04-15','2021-04-15','11','Roof restoration','459.15','632.62','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('9' ,'3','9','2021-04-15','2021-04-15','55','Roof Tile repair','599.6','730.28','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('10' ,'3','10','2021-04-15','2021-04-15','35','Roof valley repair','781.51','668.28','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('11' ,'1','11','2021-04-15','2021-04-15','58','interior and exterior service','502.38','504.25','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('12' ,'3','12','2021-04-15','2021-04-15','24','roof painting','382.31','598','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('13' ,'3','13','2021-04-15','2021-04-15','48','Roof Maintenance','156.5','947.27','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('14' ,'2','14','2021-04-15','2021-04-15','51','Roof Repair','130.15','380.5','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('15' ,'2','15','2021-04-15','2021-04-15','43','Inspection','586.59','855.13','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('16' ,'3','16','2021-04-15','2021-04-15','10','Roof replacement','299.9','196.72','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('17' ,'3','17','2021-04-15','2021-04-15','5','Roof repair and replacement','438.51','238.84','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('18' ,'3','18','2021-04-15','2021-04-15','36','Roof cleaning','86.32','560.4','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('19' ,'2','19','2021-04-15','2021-04-15','34','Roof Tile repair','95.53','307.28','2021-04-15 05:00:25', '2021-04-15 05:00:25');
INSERT INTO estimates VALUES('20' ,'2','20','2021-04-15','2021-04-15','43','Roof Maintenance','591.5','406.9','2021-04-15 05:00:25', '2021-04-15 05:00:25');

