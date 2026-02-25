export default {
    title: "Matthäus-Passion",
    subtitle: "Enträtselt",
    start: "Erlebnis Starten",
    nav_home: "Home",
    nav_play: "Die Passion",
    nav_anatomy: "Entdecken",
    discover_cta: "Entdecken Sie die Formen, Schichten und verborgenen Codes.",
    nav_story: "Die Geschichte",
    story_cta: "Folgen Sie der Zeitleiste der Passion.",
    nav_concert: "Konzertmodus",
    concert_cta: "Ablenkungsfreier Hörmodus.",
    nav_about: "Über Bach",
    discover_page: {
        title: "Die Matthäus-Passion: Eine Entdeckungsreise",
        intro: "Willkommen bei einem der monumentalsten Kunstwerke der westlichen Geschichte. Johann Sebastian Bachs *Matthäus-Passion* (BWV 244) ist viel mehr als ein langes Musikstück; es ist eine dreistündige Reise durch Verrat, Einsamkeit, Leiden und schließliche Resignation.",

        section_ritual: {
            title: "1. Das Ritual",
            content: "Heute hören wir die Matthäus-Passion in großen Konzertsälen, aber dafür wurde sie nicht geschrieben. Bach komponierte sie für den Vespergottesdienst am Karfreitag in Leipzig (1727). Es war eine musikalische Predigt, gedacht als intensives, kollektives Trauerritual. Die Zuhörer waren nicht passiv, sondern wurden dazu angeregt, über ihre eigenen Fehler, Ängste und Hoffnungen nachzudenken."
        },

        section_layers: {
            title: "2. Die Klanglandschaft",
            intro: "Wenn Sie den Eingangschor hören, werden Sie überwältigt. Zwei Orchester, zwei Chöre und ein Knabenchor singen gleichzeitig. Lassen Sie uns die Schichten freilegen.",
            layers: [
                {
                    title: "Der Herzschlag (Continuo)",
                    text: "Unter allem liegt das Fundament. Cello, Kontrabass und Orgel spielen den 'Basso Continuo'. Diese Linie hört nie auf. Sie ist der rhythmische Herzschlag, der die Passion drei Stunden lang antreibt.",
                    icon: "heartbeat"
                },
                {
                    title: "Der Stereo-Effekt",
                    text: "Bach teilte seine Musiker in **zwei komplette Chöre und zwei Orchester** auf (Chor I und Chor II). In der Kirche waren diese Gruppen räumlich getrennt. Sie singen gegeneinander, stellen Fragen und unterbrechen sich gegenseitig. Eine frühe Form von Surround-Sound.",
                    icon: "stereo"
                },
                {
                    title: "Die Klangmauer (Tutti)",
                    text: "Wenn alle zusammen singen, wird es zu einem massiven, komplexen musikalischen Organismus. Eine Klangmauer, die die kollektive Trauer der Welt trägt.",
                    icon: "waves"
                }
            ]
        },

        section_forms: {
            title: "3. Die Bausteine",
            intro: "Um die Aufmerksamkeit drei Stunden lang zu halten, verflicht Bach ständig drei 'Welten' oder Perspektiven miteinander. Wenn Sie diese erkennen, wird die Musik lebendig.",
            items: [
                { title: "Der Reporter (Rezitativ)", subtitle: "Die Handlung", text: "Der Evangelist (Tenor) singt den wörtlichen Bibeltext. Es klingt fast wie Sprechen auf Tonhöhe. Schnell und handlungsgetrieben.", play_id: "part_02", play_start: 0, play_end: 20 },
                { title: "Die Menge (Turba)", subtitle: "Das Chaos", text: "Kurze, chaotische und aggressive Unterbrechungen durch Personengruppen (Jünger, Soldaten, Mob).", play_id: "part_58", play_start: 0, play_end: 25 },
                { title: "Die Emotion (Aria)", subtitle: "Die Zeit steht still", text: "Bach tritt auf die Bremse. Ein Solist tritt vor, um den Moment in poetischen Worten zu reflektieren. Persönlich und intim.", play_id: "part_46", play_start: 0, play_end: 45 },
                { title: "Die Gemeinde (Choral)", subtitle: "Wir alle", text: "Der Chor singt einen ruhigen, bekannten Choral. Dies ist der Moment für das Publikum, kollektiv zu reflektieren.", play_id: "part_03", play_start: 0, play_end: 30 }
            ]
        },

        section_secrets: {
            title: "4. Verborgene Codes",
            intro: "Bach nutzte subtile musikalische Codes, um der Geschichte Bedeutung zu verleihen.",
            halo: {
                title: "Der Heiligenschein Jesu",
                text: "Wenn gewöhnliche Menschen sprechen, werden sie nur von 'trockenen' Akkorden begleitet. Aber **sobald Jesus spricht**, leuchtet ein weicher Teppich von Streichern um ihn herum auf. Dieser 'Musikalische Heiligenschein' hebt ihn ab – bis zum Moment seines Todes.",
                play_halo: { text: "Mit Heiligenschein", id: "part_14", start: 0, end: 30 },
                play_human: { text: "Ohne Heiligenschein (Tod)", id: "part_70", start: 15, end: 40 }
            },
            ohaupt: {
                title: "Der rote Faden",
                text: "Die Melodie 'O Haupt voll Blut und Wunden' kommt **fünfmal** vor und passt sich jedes Mal der Emotion der Geschichte an.",
                variations: [
                    { id: 1, title: "Das Versprechen", context: "Selbstvertrauen", music: "Neutral, ruhig, E-Dur", play_data: { part_id: "part_19", start: 0, end: 30 }, note_pos: 1 },
                    { id: 2, title: "Der Zweifel", context: "Petrus' Versprechen", music: "Tiefer, dunkler, Es-Dur", play_data: { part_id: "part_21", start: 0, end: 30 }, note_pos: 0.5 },
                    { id: 3, title: "Das Vertrauen", context: "Vor Pilatus", music: "Hell, hoffnungsvoll, Es-Dur", play_data: { part_id: "part_52", start: 0, end: 30 }, note_pos: 0.5 },
                    { id: 4, title: "Die Tragik", context: "Dornenkrone", music: "Qualvoll, schwer, D-Dur", play_data: { part_id: "part_62", start: 0, end: 30 }, note_pos: 0 },
                    { id: 5, title: "Die Ergebung", context: "Tod", music: "Tief, unvollendet, a-Moll", play_data: { part_id: "part_71", start: 0, end: 30 }, note_pos: -2 }
                ]
            }
        },
        conclusion: {
            title: "Bereit zuzuhören?",
            text: "Sie müssen kein Experte sein. Lassen Sie den Wechsel von Handlung, Emotion und Reflexion einfach auf sich wirken. Nutzen Sie diese App, um der Geschichte zu folgen und diese Details zu entdecken."
        }
    },
    intro_page: {
        title: "Die Matthäus-Passion: Ein musikalisches Ritual",
        intro: "Willkommen bei einem der monumentalsten Kunstwerke der westlichen Geschichte. Johann Sebastian Bachs *Matthäus-Passion* (BWV 244) ist viel mehr als ein langes Musikstück; es ist eine dreistündige Reise durch Verrat, Einsamkeit, Leiden und schließliche Resignation.\n\nAber wie hört man ein Werk dieses Ausmaßes? Worauf sollte man achten? Dieser kurze Leitfaden hilft Ihnen auf den Weg, bevor Sie in die Musik eintauchen.",
        section1_title: "1. Mehr als ein Konzert",
        section1_text: "Heute hören wir die Matthäus-Passion in großen Konzertsälen, aber dafür wurde sie nicht geschrieben. Bach komponierte sie für den Vespergottesdienst am Karfreitag in Leipzig (erstmals aufgeführt 1727). Es war eine musikalische Predigt, gedacht als intensives, kollektives Trauerritual.\n\nDie Zuhörer zu Bachs Zeiten saßen nicht passiv auf ihren Stühlen. Sie wurden von der Musik in die Geschichte Jesu mitgerissen und dazu angeregt, über ihre eigenen Fehler, Ängste und Hoffnungen nachzudenken. Die Geschichte handelt von ihm, aber die Musik handelt von uns.",
        section2_title: "2. Bachs 'Stereo-Effekt'",
        section2_text: "Was die Matthäus-Passion sofort so überwältigend macht, ist die räumliche Anordnung. Bach teilte seine Musiker in **zwei komplette Chöre und zwei Orchester** auf (Chor I und Chor II).\n\nIn der Kirche waren diese Gruppen räumlich getrennt. Bach nutzte dies für eine frühe Art von 'Stereo-Effekt'. Die Chöre singen nicht nur miteinander, sondern oft auch gegeneinander. Sie stellen sich gegenseitig Fragen, fallen einander ins Wort oder ergänzen ihre Sätze.\n* **Chor I** repräsentiert oft die 'Töchter Zion' (die treuen Anhänger, die Träger des Schmerzes).\n* **Chor II** stellt die Fragen in unserem Namen, den verwirrten Zuschauern (*\"Wen?\", \"Wie?\", \"Wohin?\"*).",
        section3_title: "3. Drei ineinandergreifende Welten",
        section3_intro: "Um die Aufmerksamkeit drei Stunden lang zu halten, nutzte Bach eine brillante Struktur. Er verflicht ständig drei verschiedene 'Zeitzonen' oder Perspektiven miteinander:",
        world1_title: "Die Handlung (Die biblische Geschichte)",
        world1_text: "Dies ist das Rückgrat. Der *Evangelist* (ein Tenor) ist der Berichterstatter. Er singt den wörtlichen Bibeltext in einem schnellen, sprachähnlichen Rhythmus (Rezitativ). Dazwischen hören wir die Charaktere: Jesus, Petrus, Pilatus und die wütende Menge (die *Turba*-Chöre). Die Zeit tickt hier unaufhaltsam weiter.",
        world2_title: "Die Emotion (Die Arien)",
        world2_text: "In den dramatischsten Momenten der Geschichte drückt Bach plötzlich die Pausetaste. Die Zeit steht still. Ein Solist tritt quasi nach vorne und besingt in einer Arie, was der Moment mit ihm (und mit uns) macht. Dies sind die Momente tiefer, persönlicher Reflexion, oft begleitet von ein oder zwei Soloinstrumenten.",
        world3_title: "Die Gemeinde (Die Choräle)",
        world3_text: "Nach der Handlung und der persönlichen Emotion zoomt Bach auf das Kollektiv heraus. Der Chor singt einen Choral: ein bekanntes Kirchenlied mit einer relativ einfachen Melodie. Zu Bachs Zeiten kannte jeder diese Melodien auswendig. Dies ist die Stimme der Gemeinschaft, der Moment, in dem wir als Zuhörer (in Gedanken) mitsingen und auf die Geschichte reagieren.",
        conclusion_title: "Bereit zuzuhören?",
        conclusion_text: "Sie müssen die deutsche Sprache nicht perfekt beherrschen, und Sie müssen kein Theologe oder Musikwissenschaftler sein, um die Matthäus-Passion zu erleben. Lassen Sie den Wechsel von schneller Handlung, intimen Arien und beruhigenden Chorälen auf sich wirken.\n\nMit dieser App können Sie die Struktur und die Übersetzungen genau verfolgen und die verborgenen Details entdecken, die Bach in seiner Partitur hinterlassen hat."
    },
    previous: "Zurück",
    trivia: "Wussten Sie schon?",
    next: "Weiter",
    story_page: {
        title: "Die Geschichte: Eine Reise in zwei Teilen",
        intro: "Die *Matthäus-Passion* folgt wörtlich dem Text des Matthäusevangeliums (Kapitel 26 und 27). Sie erzählt die letzten Tage Jesu, von den Plänen, ihn zu töten, bis zu seinem Begräbnis.\n\nZu Bachs Zeiten dauerte der gesamte Karfreitagsgottesdienst gut fünf Stunden. Zwischen Teil 1 und Teil 2 der Musik gab es eine über einstündige Predigt. Unten finden Sie die Zeitachse der Geschichte, damit Sie immer wissen, wo wir uns befinden.",
        part1_title: "TEIL 1: DER VERRAT",
        part1_subtitle: "Der Auftakt: Mittwoch bis Donnerstag Nacht",
        part1_intro: "Dieser Teil baut die Spannung langsam auf. Er beginnt in Intimität mit Freunden, endet aber in einer gewaltsamen Verhaftung in der Nacht.",
        part2_title: "TEIL 2: DAS URTEIL UND DIE KREUZIGUNG",
        part2_subtitle: "Der Leidensweg: Freitagmorgen bis Freitagabend",
        part2_intro: "Der zweite Teil ist länger, rauer und dramatischer. Das Tempo der Gerichtsverhandlungen ist hoch und die Menge (der Chor) wird zunehmend aggressiver.",
        listen_button: "Diese Szene anhören",
        chapters: [
            { "id": 1, "time_context": "Mittwoch / Gründonnerstag", "title": "1. Das Komplott und die Salbung", "text": "Die religiösen Führer in Jerusalem schmieden heimlich Pläne, um Jesus aus dem Weg zu räumen, fürchten aber einen Aufstand des Volkes. Inzwischen ist Jesus in Bethanien, wo eine Frau ihn mit kostbarem Öl salbt. Die Jünger halten dies für Geldverschwendung, aber Jesus verteidigt sie: Sie bereitet ihn auf sein Begräbnis vor. Kurz darauf geht Judas zu den Hohepriestern, um Jesus für dreißig Silberlinge zu verraten. Dies war damals der gesetzliche Preis für einen Sklaven. Ein Spottpreis für ein Menschenleben, was die Demütigung des Verrats noch schmerzhafter macht.", "listen_link": "part_04", "part": 1 },
            { "id": 2, "time_context": "Gründonnerstag - Abend", "title": "2. Das letzte Abendmahl", "text": "Jesus feiert das Passahmahl mit seinen zwölf Jüngern. Die Stimmung ist bedrückt, denn er sagt voraus, dass einer von ihnen ihn verraten wird. Unsicher fragen sie sich: 'Bin ich es, Herr?' Jesus bricht das Brot und teilt den Wein als Symbol für seinen Körper und sein Blut, das für sie hingegeben wird.", "listen_link": "part_10", "part": 1 },
            { "id": 3, "time_context": "Donnerstag Nacht", "title": "3. Der Ölberg (Gethsemane)", "text": "Nach dem Mahl gehen sie in den Garten Gethsemane am Ölberg. Jesus spürt enorme Todesangst und bittet Gott, ob dieser Leidensweg an ihm vorübergehen darf, 'aber nicht wie ich will, sondern wie du willst.' Er bittet seine Freunde, mit ihm zu wachen, aber sie schlafen dreimal ein.", "listen_link": "part_22", "part": 1 },
            { "id": 4, "time_context": "Tiefe Nacht", "title": "4. Die Verhaftung", "text": "Judas kommt mit einer bewaffneten Bande. Er küsst Jesus; dies ist das vereinbarte Zeichen, um ihn zu identifizieren. Petrus zieht in Panik sein Schwert und schlägt einem Knecht das Ohr ab, aber Jesus stoppt die Gewalt. Er lässt sich freiwillig fesseln. Alle Jünger geraten in Panik und fliehen in die Nacht.", "listen_link": "part_31", "part": 1 },
            { "id": 5, "time_context": "Karfreitag - Früher Morgen", "title": "5. Das Verhör vor Kaiphas", "text": "Jesus wird vor den Hohepriester Kaiphas gebracht. Falsche Zeugen werden aufgerufen, aber Jesus schweigt. Erst als Kaiphas ihn unter Eid fragt, ob er der Sohn Gottes sei, spricht er die bestätigenden Worte. Der Rat zerreißt empört die Kleider und verurteilt ihn wegen Gotteslästerung. Jesus wird ins Gesicht gespuckt und verspottet.", "listen_link": "part_37", "part": 2 },
            { "id": 6, "time_context": "Vor Sonnenaufgang", "title": "6. Die Verleugnung des Petrus", "text": "Draußen im Hof wartet Petrus. Dreimal wird er von Umstehenden als Anhänger Jesu erkannt. Dreimal leugnet Petrus, ihn zu kennen, beim letzten Mal sogar fluchend. Dann kräht ein Hahn. Petrus erinnert sich, dass Jesus dies genau vorhergesagt hatte, rennt hinaus und weint bitterlich.", "listen_link": "part_45", "part": 2 },
            { "id": 7, "time_context": "Morgen", "title": "7. Das Ende des Judas", "text": "Judas bereut seinen Verrat, als er hört, dass Jesus zum Tode verurteilt wurde. Er wirft das Blutgeld in den Tempel zurück, aber die Priester weigern sich, es anzunehmen. In blinder Verzweiflung erhängt sich Judas.", "listen_link": "part_48", "part": 2 },
            { "id": 8, "time_context": "Morgen", "title": "8. Vor Pilatus und Barabbas", "text": "Da der Hohe Rat die Todesstrafe nicht vollstrecken darf, bringen sie Jesus zum römischen Statthalter Pontius Pilatus. Pilatus sieht keine Schuld in ihm. Er versucht, Jesus freizubekommen, indem er das Volk wählen lässt: Wen soll ich freilassen, den Mörder Barabbas oder Jesus? Von den Priestern angestachelt, schreit die Menge nach Barabbas. Pilatus wäscht seine Hände in Unschuld und liefert Jesus aus.", "listen_link": "part_53", "part": 2 },
            { "id": 9, "time_context": "Später Morgen", "title": "9. Die Geißelung und die Dornenkrone", "text": "Jesus wird von den römischen Soldaten schwer gegeißelt. Sie ziehen ihn aus, legen ihm einen Purpurmantel um die Schultern und drücken ihm eine Krone aus geflochtenen Dornenzweigen auf den Kopf. Sie verspotten ihn als falschen König und schlagen ihn.", "listen_link": "part_59", "part": 2 },
            { "id": 10, "time_context": "Gegen Mittag", "title": "10. Der Kreuzweg und Golgatha", "text": "Jesus muss sein eigenes Kreuz tragen, ist aber zu geschwächt. Ein Vorübergehender, Simon von Kyrene, wird gezwungen, ihm zu helfen. Am Hügel Golgotha (der Schädelstätte) angekommen, wird er zwischen zwei Mördern gekreuzigt. Die Umstehenden verhöhnen ihn weiter: 'Wenn du Gottes Sohn bist, steig von dem Kreuz herab!'", "listen_link": "part_63", "part": 2 },
            { "id": 11, "time_context": "15:00 Uhr (Die neunte Stunde)", "title": "11. Der Tod", "text": "Ab der Mittagsstunde bricht eine tiefe Finsternis über das Land herein. Gegen drei Uhr schreit Jesus auf: 'Mein Gott, mein Gott, warum hast du mich verlassen?' Kurz darauf stirbt er. Die Erde bebt, die Felsen zerreißen und der Vorhang im Tempel reißt entzwei. Ein dabeistehender römischer Hauptmann flüstert voller Ehrfurcht: 'Wahrhaftig, dieser war Gottes Sohn.'", "listen_link": "part_70", "part": 2 },
            { "id": 12, "time_context": "Freitagabend", "title": "12. Das Begräbnis", "text": "Am Abend bittet Joseph von Arimathäa, ein wohlhabender Anhänger, um die Erlaubnis, den Leichnam zu begraben. Er wickelt Jesus in Leinen und legt ihn in ein neues, in den Fels gehauenes Grab. Ein schwerer Stein wird davor gewälzt. Die Passion endet mit einem großen, sanften Choral, in dem der Chor dem Verstorbenen einen letzten, tröstenden Gruß bringt: 'Ruhe sanfte, sanfte ruh.'", "listen_link": "part_74", "part": 2 }
        ]
    },
    guide_page: {
        title: "Hörführer: Die Bausteine der Passion",
        listen_cta: "Anhören",
        intro: "Die *Matthäus-Passion* ist ein gigantisches musikalisches Bauwerk. Um die Aufmerksamkeit drei Stunden lang zu halten, verflicht Bach ständig drei 'Welten' miteinander: die schnelle Handlung, die eingefrorene Emotion und die Reaktion des Volkes.\n\nWenn Sie diese musikalischen Bausteine erkennen, wird die Musik für Sie lebendig. Klicken Sie auf die Abspielbuttons, um sofort ein kurzes Beispiel zu hören.",
        section1_title: "1. Die vier Hauptformen",
        forms: [
            { "title": "Das Rezitativ: Der Reporter (Handlung)", "text": "Dies ist der Motor der Geschichte. Der *Evangelist* (ein Tenor) singt den wörtlichen Text aus der Bibel. Es klingt fast wie Sprechen auf Tonhöhe. Es gibt keine feststehende Melodie und der Rhythmus folgt der gewöhnlichen Sprache. Die Begleitung ist minimal: oft nur ein Cello und eine Orgel (*Basso continuo*). Dadurch geht die Geschichte in hohem Tempo weiter.", "play_text": "Der Evangelist beginnt die Geschichte", "play_data": { "part_id": "part_02", "start": 0, "end": 20 } },
            { "title": "Die Arie: Die Zeit steht still (Emotion)", "text": "Wenn etwas sehr Dramatisches passiert, tritt Bach auf die Bremse. Die Zeit steht still. Ein Solist tritt nach vorne und besingt in poetischen Worten, was das Ereignis mit ihm oder ihr (und mit uns) macht. Eine Arie ist musikalisch sehr reich, oft begleitet von wunderschönen Soloinstrumenten wie einer Violine oder Flöte. Es ist ein Moment reiner, persönlicher Reflexion.", "play_text": "Die Violin-Solo und Alt in 'Erbarme dich'", "play_data": { "part_id": "part_46", "start": 0, "end": 45 } },
            { "title": "Der Chor (Turba): Die Menge", "text": "Manchmal macht der Evangelist eine Pause und wir hören die Charaktere selbst sprechen. Wenn das eine Gruppe von Menschen ist (die Jünger, die Soldaten oder die wütende Menge), nennt man das einen *Turba*-Chor (lateinisch für Menge). Diese Chöre sind oft kurz, chaotisch, theatralisch und manchmal geradezu aggressiv.", "play_text": "Die Menge schreit: 'Lass ihn kreuzigen!'", "play_data": { "part_id": "part_58", "start": 0, "end": 25 } },
            { "title": "Der Choral: Wir alle (Gemeinde)", "text": "Nach der heftigen Handlung oder einer bewegenden Arie zoomt Bach heraus. Der Chor singt einen Choral: ein bekanntes Kirchenlied mit einer erkennbaren, ruhigen Melodie. Zu Bachs Zeiten sang die Gemeinde diese Lieder wöchentlich in der Kirche. Es ist der Moment, in dem wir als Zuschauer kollektiv auf das reagieren, was mit Jesus passiert.", "play_text": "Der erste ruhige Choral: 'Herzliebster Jesu'", "play_data": { "part_id": "part_03", "start": 0, "end": 30 } }
        ],
        section2_title: "2. Der verborgene Code: Der Heiligenschein Jesu",
        section2_text: "Bach nutzte subtile Tricks, um der Musik Bedeutung zu verleihen. Eines der schönsten Beispiele ist der Unterschied zwischen zwei Arten von Rezitativen: *Secco* (trocken) und *Accompagnato* (begleitet von Streichern).\n\nWenn gewöhnliche Menschen (wie Petrus, Pilatus oder Judas) in der Geschichte sprechen, werden sie nur vom 'trockenen' Cello und der Orgel begleitet. Aber **sobald Jesus spricht, geschieht etwas Magisches**. Bach fügt einen weichen Teppich von Streichern hinzu. Dies wird oft sein \"musikalischer Heiligenschein\" genannt. Er betont seine göttliche Ruhe.",
        section2_play1_text: "Hören Sie auf die Streicher, die sanft einsetzen, als Jesus spricht",
        section2_play1_data: { "part_id": "part_14", "start": 0, "end": 30 },
        section2_exception: "**Die große Ausnahme:** Es gibt einen Moment in der gesamten Passion, in dem Jesus diesen Streicher-Heiligenschein verliert. Am Kreuz schreit er: *\"Mein Gott, warum hast du mich verlassen?\"* In diesem Moment schweigen die Streicher. Jesus ist völlig verlassen und stirbt als einsamer Sterblicher, nur begleitet vom kahlen Cello.",
        section2_play2_text: "Jesus schreit es ohne seinen Heiligenschein heraus",
        section2_play2_data: { "part_id": "part_70", "start": 15, "end": 40 },
        section3_title: "3. Meisterklasse: Fünfmal 'O Haupt'",
        section3_intro: "Einer der genialsten Einfälle in der Matthäus-Passion ist, wie Bach ein und dieselbe Melodie verwendet, um die ganze Geschichte miteinander zu verknüpfen. Die Melodie des Chorals *\"O Haupt voll Blut und Wunden\"* kommt nicht weniger als **fünfmal** vor.\n\nDoch sie klingt jedes Mal anders. Bach ändert die Tonart, die Harmonie und die Tonhöhe, um genau die Emotion dieses spezifischen Moments in der Geschichte einzufangen. Vergleichen Sie sie unten:",
        ohaupt_variations: [
            { "id": 1, "title": "1. Das Versprechen (Teil 19)", "context": "Jesus sagt voraus, dass alle ihn verlassen werden. Die Gemeinde antwortet selbstbewusst: 'Ich erkenne dich, ich bleibe bei dir.'", "music": "Klinkt relativ neutral, ruhig und voller Selbstvertrauen.", "play_data": { "part_id": "part_19", "start": 0, "end": 30 }, "staff_config": { "note_position": 1, "label": "E-Dur" } },
            { "id": 2, "title": "2. Der Zweifel (Teil 21)", "context": "Petrus schwört, dass er Jesus niemals verlassen wird, auch wenn er sterben muss.", "music": "Die Melodie ist jetzt einen Ganzton tiefer. Sie klingt etwas dunkler und vorsichtiger, als ob die Musik schon wüsste, dass Petrus sein Versprechen brechen wird.", "play_data": { "part_id": "part_21", "start": 0, "end": 30 }, "staff_config": { "note_position": 0.5, "label": "Es-Dur" } },
            { "id": 3, "title": "3. Das Vertrauen (Teil 52)", "context": "Jesus steht schweigend vor Pilatus während eines unfairen Prozesses.", "music": "Überraschenderweise klingt die Melodie hier sehr hell und hoffnungsvoll (in einer dur-ähnlichen Harmonisierung). Sie strahlt ein felsenfestes Vertrauen auf Gott aus, quer durch das Unrecht hindurch.", "play_data": { "part_id": "part_52", "start": 0, "end": 30 }, "staff_config": { "note_position": 0.5, "label": "Es-Dur" } },
            { "id": 4, "title": "4. Die Tragik (Teil 62)", "context": "Jesus wurde gerade verspottet und hat die Dornenkrone aufgesetzt bekommen.", "music": "Dies ist die bekannteste, reinste und zugleich tragischste Version. Die Harmonie ist qualvoll und schwer. Die Melodie ist wieder in der Tonhöhe gesunken: das Haupt neigt sich.", "play_data": { "part_id": "part_62", "start": 0, "end": 30 }, "staff_config": { "note_position": 0, "label": "D-Dur" } },
            { "id": 5, "title": "5. Die Ergebung (Teil 71)", "context": "Jesus ist gerade am Kreuz gestorben.", "music": "Das allerletzte Mal, dass wir die Melodie hören. Sie wird sehr tief gesungen. Die Harmonisierung ist so geschrieben, dass der Choral eigentlich 'unvollendet' klingt. Es ist ein Gebet für unsere eigene Sterbestunde: Der Tod ist nicht das Ende, sondern ein Übergang.", "play_data": { "part_id": "part_71", "start": 0, "end": 30 }, "staff_config": { "note_position": -2, "label": "a-Moll" } }
        ]
    },
    anatomy: {
        title: "Anatomie eines Meisterwerks",
        subtitle: "Scrollen, um die Schichten zu entdecken",
        stages: [
            {
                id: "intro",
                title: "Das Tutti: Eine Klangmauer",
                text: "Wenn Sie den Eingangschor hören, werden Sie überwältigt. Zwei Orchester, zwei Chöre und ein Knabenchor singen gleichzeitig. Es ist ein massiver, komplexer musikalischer Organismus.",
                visual_label: "Tutti"
            },
            {
                id: "stereo",
                title: "Der Stereo-Effekt",
                text: "Bach spaltet diese Masse in zwei Gruppen: Chor I und Chor II. In der Thomaskirche standen sie weit auseinander. Sie singen gegeneinander, stellen Fragen und unterbrechen sich gegenseitig. Eine frühe Form von Surround-Sound.",
                visual_label: "Chor I vs Chor II"
            },
            {
                id: "continuo",
                title: "Der Herzschlag (Continuo)",
                text: "Unter allem liegt das Fundament. Cello, Kontrabass und Orgel spielen den 'Basso Continuo'. Diese Linie hört nie auf. Sie ist der rhythmische Herzschlag, der die Passion drei Stunden lang antreibt.",
                visual_label: "Basso Continuo"
            },
            {
                id: "halo",
                title: "Der Heiligenschein Jesu",
                text: "Wenn Jesus spricht, verändert sich die Welt. Die 'trockene' Begleitung verschwindet und ein Streichquartett leuchtet um ihn herum auf. Dieser 'Musikalische Heiligenschein' hebt ihn von allen anderen Charakteren ab.",
                visual_label: "Jesus + Streicher"
            },
            {
                id: "solo",
                title: "Der Solist: Intimität",
                text: "Die Masse schweigt. Ein Sänger tritt vor, begleitet von einem Instrument (z.B. einer Violine). Sie treten in einen Dialog. Dies ist der Moment für individuelle Reflexion inmitten des großen Dramas.",
                visual_label: "Alt + Violine"
            }
        ],
        example_btn: "Luister / Listen"
    },
    about_project: {
        title: "Über dieses Projekt",
        subtitle: "Bachs Meisterwerk für alle zugänglich machen.",
        mission_title: "Die Mission",
        mission_text: "Die Matthäus-Passion ist eines der größten Kunstwerke aller Zeiten, aber ihre Komplexität kann überwältigend sein. Dieses Projekt zielt darauf ab, die Schichten von Musik, Text und Struktur zu enträtseln und einen modernen, interaktiven Leitfaden für Neulinge und Kenner zu schaffen.",
        contribute_title: "Beitragen",
        contribute_text: "Dies ist ein Open-Source-Projekt. Wir begrüßen Beiträge zur Verbesserung von Übersetzungen, zum Hinzufügen musikalischer Erkenntnisse oder zur Behebung von Fehlern. Sie können direkt über GitHub beitragen.",
        github_soon: "Auf GitHub ansehen",
        video_copyright: "Video © Nederlandse Bachvereniging - allofbach.com"
    }
};
