// import { PrismaClient, Role, TypePeriode, CategorieMatiere } from "/app/generated/prisma/client/client";
import { Role,TypePeriode, CategorieMatiere } from "./app/generated/prisma/enums";
import { hash } from "bcrypt";

// Utilisation de votre configuration prisma
import { prisma } from "./lib/prisma";

async function main() {
  console.log("🌱 Début du seeding...");

  // Nettoyage de la base de données (optionnel, commentez si vous voulez garder les données existantes)
  await prisma.conversationIA.deleteMany();
  await prisma.statistiqueEtudiant.deleteMany();
  await prisma.appreciation.deleteMany();
  await prisma.note.deleteMany();
  await prisma.matiere.deleteMany();
  await prisma.periode.deleteMany();
  await prisma.etudiant.deleteMany();
  await prisma.classe.deleteMany();
  await prisma.anneeScolaire.deleteMany();
  await prisma.etablissement.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Base de données nettoyée");

  // Hash du mot de passe (même pour tous pour simplifier les tests)
  const hashedPassword = await hash("password123", 10);

  // ==================== 1. CRÉATION DE L'ADMIN ====================
  console.log("👤 Création de l'admin...");
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@statai.com",
      password: hashedPassword,
      role: Role.ADMIN,
      nom: "Admin",
      prenom: "Système",
    },
  });
  console.log(`✅ Admin créé: ${adminUser.email}`);

  // ==================== 2. CRÉATION DE L'ÉTABLISSEMENT ====================
  console.log("🏫 Création de l'établissement...");
  const etablissementUser = await prisma.user.create({
    data: {
      email: "etablissement@lycee-example.com",
      password: hashedPassword,
      role: Role.ETABLISSEMENT,
      nom: "Lycée",
      prenom: "Excellence",
    },
  });

  const etablissement = await prisma.etablissement.create({
    data: {
      nom: "Lycée d'Excellence",
      adresse: "123 Avenue de l'Éducation, Lomé",
      telephone: "+228 22 23 24 25",
      email: "etablissement@lycee-example.com",
      userId: etablissementUser.id,
    },
  });
  console.log(`✅ Établissement créé: ${etablissement.nom}`);

  // ==================== 3. CRÉATION DES ANNÉES SCOLAIRES ====================
  console.log("📅 Création des années scolaires...");
  const annee2021_2022 = await prisma.anneeScolaire.create({
    data: {
      libelle: "2021-2022",
      dateDebut: new Date("2021-09-01"),
      dateFin: new Date("2022-06-30"),
      active: false,
      etablissementId: etablissement.id,
    },
  });

  const annee2022_2023 = await prisma.anneeScolaire.create({
    data: {
      libelle: "2022-2023",
      dateDebut: new Date("2022-09-01"),
      dateFin: new Date("2023-06-30"),
      active: true,
      etablissementId: etablissement.id,
    },
  });
  console.log(`✅ Années créées: ${annee2021_2022.libelle}, ${annee2022_2023.libelle}`);

  // ==================== 4. CRÉATION DES CLASSES ====================
  console.log("🎓 Création des classes...");
  const classe1 = await prisma.classe.create({
    data: {
      nom: "Terminale S1",
      niveau: "Terminale",
      description: "Classe de Terminale Scientifique section 1",
      etablissementId: etablissement.id,
    },
  });

  const classe2 = await prisma.classe.create({
    data: {
      nom: "Terminale L1",
      niveau: "Terminale",
      description: "Classe de Terminale Littéraire section 1",
      etablissementId: etablissement.id,
    },
  });
  console.log(`✅ Classes créées: ${classe1.nom}, ${classe2.nom}`);

  // ==================== 5. CRÉATION DES PÉRIODES ====================
  console.log("📆 Création des périodes...");
  
  // Périodes pour l'année 2021-2022
  const periodes2021_classe1 = await Promise.all([
    prisma.periode.create({
      data: {
        numero: 1,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2021-09-01"),
        dateFin: new Date("2022-01-31"),
        anneeId: annee2021_2022.id,
        classeId: classe1.id,
      },
    }),
    prisma.periode.create({
      data: {
        numero: 2,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2022-02-01"),
        dateFin: new Date("2022-06-30"),
        anneeId: annee2021_2022.id,
        classeId: classe1.id,
      },
    }),
  ]);

  const periodes2021_classe2 = await Promise.all([
    prisma.periode.create({
      data: {
        numero: 1,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2021-09-01"),
        dateFin: new Date("2022-01-31"),
        anneeId: annee2021_2022.id,
        classeId: classe2.id,
      },
    }),
    prisma.periode.create({
      data: {
        numero: 2,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2022-02-01"),
        dateFin: new Date("2022-06-30"),
        anneeId: annee2021_2022.id,
        classeId: classe2.id,
      },
    }),
  ]);

  // Périodes pour l'année 2022-2023
  const periodes2022_classe1 = await Promise.all([
    prisma.periode.create({
      data: {
        numero: 1,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2022-09-01"),
        dateFin: new Date("2023-01-31"),
        anneeId: annee2022_2023.id,
        classeId: classe1.id,
      },
    }),
    prisma.periode.create({
      data: {
        numero: 2,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2023-02-01"),
        dateFin: new Date("2023-06-30"),
        anneeId: annee2022_2023.id,
        classeId: classe1.id,
      },
    }),
  ]);

  const periodes2022_classe2 = await Promise.all([
    prisma.periode.create({
      data: {
        numero: 1,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2022-09-01"),
        dateFin: new Date("2023-01-31"),
        anneeId: annee2022_2023.id,
        classeId: classe2.id,
      },
    }),
    prisma.periode.create({
      data: {
        numero: 2,
        typePeriode: TypePeriode.SEMESTRE,
        dateDebut: new Date("2023-02-01"),
        dateFin: new Date("2023-06-30"),
        anneeId: annee2022_2023.id,
        classeId: classe2.id,
      },
    }),
  ]);

  console.log(`✅ Périodes créées pour les 2 années et 2 classes`);

  // ==================== 6. CRÉATION DES MATIÈRES ====================
  console.log("📚 Création des matières...");
  
  // Matières pour Classe 1 (Terminale S1)
  const matieresClasse1 = await Promise.all([
    // Sciences (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Mathématiques",
        code: "MATH",
        categorie: CategorieMatiere.SCIENCE,
        coefficient: 4,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "Physique-Chimie",
        code: "PC",
        categorie: CategorieMatiere.SCIENCE,
        coefficient: 3,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
    // Littérature (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Français",
        code: "FR",
        categorie: CategorieMatiere.LITTERATURE,
        coefficient: 2,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "Philosophie",
        code: "PHILO",
        categorie: CategorieMatiere.LITTERATURE,
        coefficient: 2,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
    // Art & Sport (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Éducation Physique",
        code: "EPS",
        categorie: CategorieMatiere.ART_SPORT,
        coefficient: 1,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "Arts Plastiques",
        code: "ART",
        categorie: CategorieMatiere.ART_SPORT,
        coefficient: 1,
        etablissementId: etablissement.id,
        classeId: classe1.id,
      },
    }),
  ]);

  // Matières pour Classe 2 (Terminale L1)
  const matieresClasse2 = await Promise.all([
    // Sciences (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Mathématiques",
        code: "MATH",
        categorie: CategorieMatiere.SCIENCE,
        coefficient: 2,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "SVT",
        code: "SVT",
        categorie: CategorieMatiere.SCIENCE,
        coefficient: 2,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
    // Littérature (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Français",
        code: "FR",
        categorie: CategorieMatiere.LITTERATURE,
        coefficient: 4,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "Histoire-Géographie",
        code: "HG",
        categorie: CategorieMatiere.LITTERATURE,
        coefficient: 3,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
    // Art & Sport (2 matières)
    prisma.matiere.create({
      data: {
        nom: "Éducation Physique",
        code: "EPS",
        categorie: CategorieMatiere.ART_SPORT,
        coefficient: 1,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
    prisma.matiere.create({
      data: {
        nom: "Musique",
        code: "MUS",
        categorie: CategorieMatiere.ART_SPORT,
        coefficient: 1,
        etablissementId: etablissement.id,
        classeId: classe2.id,
      },
    }),
  ]);

  console.log(`✅ Matières créées: ${matieresClasse1.length} pour ${classe1.nom}, ${matieresClasse2.length} pour ${classe2.nom}`);

  // ==================== 7. CRÉATION DES ÉTUDIANTS ====================
  console.log("👨‍🎓 Création des étudiants...");

  // Fonction helper pour créer un étudiant
  async function createEtudiant(
    nom: string,
    prenom: string,
    matricule: string,
    classeId: string,
    envies: string
  ) {
    const userEtudiant = await prisma.user.create({
      data: {
        email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@student.com`,
        password: hashedPassword,
        role: Role.ETUDIANT,
        nom,
        prenom,
      },
    });

    return prisma.etudiant.create({
      data: {
        matricule,
        nom,
        prenom,
        dateNaissance: new Date("2005-05-15"),
        lieuNaissance: "Lomé",
        sexe: Math.random() > 0.5 ? "M" : "F",
        adresse: `${Math.floor(Math.random() * 100)} Rue de l'Université`,
        telephone: `+228 ${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: userEtudiant.email,
        envies,
        userId: userEtudiant.id,
        etablissementId: etablissement.id,
        classeId,
      },
    });
  }

  // 3 étudiants pour Classe 1 (Terminale S1)
  const etudiantsClasse1 = await Promise.all([
    createEtudiant(
      "Dupont",
      "Jean",
      "2021TS001",
      classe1.id,
      JSON.stringify({
        aspirations: ["Devenir ingénieur informatique", "Travailler dans l'IA"],
        interets: ["Programmation", "Mathématiques", "Jeux vidéo"],
        objectifs: "Intégrer une grande école d'ingénieurs",
      })
    ),
    createEtudiant(
      "Martin",
      "Sophie",
      "2021TS002",
      classe1.id,
      JSON.stringify({
        aspirations: ["Devenir médecin", "Recherche médicale"],
        interets: ["Biologie", "Chimie", "Aide humanitaire"],
        objectifs: "Études de médecine",
      })
    ),
    createEtudiant(
      "Kouassi",
      "Ama",
      "2021TS003",
      classe1.id,
      JSON.stringify({
        aspirations: ["Physicienne", "Astrophysique"],
        interets: ["Sciences", "Astronomie", "Lecture"],
        objectifs: "Doctorat en physique",
      })
    ),
  ]);

  // 3 étudiants pour Classe 2 (Terminale L1)
  const etudiantsClasse2 = await Promise.all([
    createEtudiant(
      "Bernard",
      "Lucas",
      "2021TL001",
      classe2.id,
      JSON.stringify({
        aspirations: ["Journaliste", "Écrivain"],
        interets: ["Littérature", "Actualités", "Débats"],
        objectifs: "École de journalisme",
      })
    ),
    createEtudiant(
      "Dubois",
      "Emma",
      "2021TL002",
      classe2.id,
      JSON.stringify({
        aspirations: ["Professeure de français", "Traductrice"],
        interets: ["Langues", "Littérature", "Voyage"],
        objectifs: "Master en lettres",
      })
    ),
    createEtudiant(
      "Amani",
      "Kofi",
      "2021TL003",
      classe2.id,
      JSON.stringify({
        aspirations: ["Historien", "Archéologue"],
        interets: ["Histoire", "Culture", "Patrimoine"],
        objectifs: "Recherche en histoire africaine",
      })
    ),
  ]);

  console.log(`✅ Étudiants créés: ${etudiantsClasse1.length} en ${classe1.nom}, ${etudiantsClasse2.length} en ${classe2.nom}`);

  // ==================== 8. CRÉATION DES NOTES ====================
  console.log("📝 Création des notes...");

  // Fonction helper pour générer des notes réalistes
  function genererNote(moyenne: number = 12, variance: number = 4): number {
    const note = moyenne + (Math.random() - 0.5) * variance * 2;
    return Math.max(0, Math.min(20, parseFloat(note.toFixed(2))));
  }

  // Fonction pour créer des notes pour un étudiant dans toutes les matières et périodes
  async function creerNotesEtudiant(
    etudiantId: string,
    matieres: any[],
    periodes: any[],
    tendance: "fort" | "moyen" | "faible"
  ) {
    const moyenneBase = tendance === "fort" ? 15 : tendance === "moyen" ? 12 : 9;
    const notes = [];

    for (const matiere of matieres) {
      for (const periode of periodes) {
        // Créer 2-3 notes par matière par période
        const nbNotes = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < nbNotes; i++) {
          notes.push(
            prisma.note.create({
              data: {
                valeur: genererNote(moyenneBase),
                surTotal: 20,
                date: new Date(periode.dateDebut.getTime() + Math.random() * (periode.dateFin.getTime() - periode.dateDebut.getTime())),
                commentaire: i === 0 ? "Devoir surveillé" : i === 1 ? "Devoir maison" : "Interrogation",
                etudiantId,
                matiereId: matiere.id,
                periodeId: periode.id,
              },
            })
          );
        }
      }
    }

    return Promise.all(notes);
  }

  // Création des notes pour Classe 1
  await creerNotesEtudiant(etudiantsClasse1[0].id, matieresClasse1, [...periodes2021_classe1, ...periodes2022_classe1], "fort");
  await creerNotesEtudiant(etudiantsClasse1[1].id, matieresClasse1, [...periodes2021_classe1, ...periodes2022_classe1], "moyen");
  await creerNotesEtudiant(etudiantsClasse1[2].id, matieresClasse1, [...periodes2021_classe1, ...periodes2022_classe1], "fort");

  // Création des notes pour Classe 2
  await creerNotesEtudiant(etudiantsClasse2[0].id, matieresClasse2, [...periodes2021_classe2, ...periodes2022_classe2], "moyen");
  await creerNotesEtudiant(etudiantsClasse2[1].id, matieresClasse2, [...periodes2021_classe2, ...periodes2022_classe2], "fort");
  await creerNotesEtudiant(etudiantsClasse2[2].id, matieresClasse2, [...periodes2021_classe2, ...periodes2022_classe2], "faible");

  console.log(`✅ Notes créées pour tous les étudiants`);

  // ==================== 9. CRÉATION DES APPRÉCIATIONS ====================
  console.log("💬 Création des appréciations...");

  const appreciations = [
    { type: "Comportement", contenu: "Élève sérieux et attentif en classe." },
    { type: "Travail", contenu: "Bon travail fourni, continue ainsi." },
    { type: "Progrès", contenu: "Nets progrès observés ce semestre." },
    { type: "Comportement", contenu: "Participe activement aux cours." },
    { type: "Travail", contenu: "Doit fournir plus d'efforts réguliers." },
    { type: "Progrès", contenu: "Quelques difficultés mais bonne volonté." },
  ];

  async function creerAppreciationsEtudiant(etudiantId: string, periodes: any[]) {
    const apps = [];
    for (const periode of periodes) {
      const appreciation = appreciations[Math.floor(Math.random() * appreciations.length)];
      apps.push(
        prisma.appreciation.create({
          data: {
            contenu: appreciation.contenu,
            type: appreciation.type,
            etudiantId,
            periodeId: periode.id,
          },
        })
      );
    }
    return Promise.all(apps);
  }

  // Appréciations pour tous les étudiants
  await creerAppreciationsEtudiant(etudiantsClasse1[0].id, [...periodes2021_classe1, ...periodes2022_classe1]);
  await creerAppreciationsEtudiant(etudiantsClasse1[1].id, [...periodes2021_classe1, ...periodes2022_classe1]);
  await creerAppreciationsEtudiant(etudiantsClasse1[2].id, [...periodes2021_classe1, ...periodes2022_classe1]);
  await creerAppreciationsEtudiant(etudiantsClasse2[0].id, [...periodes2021_classe2, ...periodes2022_classe2]);
  await creerAppreciationsEtudiant(etudiantsClasse2[1].id, [...periodes2021_classe2, ...periodes2022_classe2]);
  await creerAppreciationsEtudiant(etudiantsClasse2[2].id, [...periodes2021_classe2, ...periodes2022_classe2]);

  console.log(`✅ Appréciations créées pour tous les étudiants`);

  console.log("\n🎉 Seeding terminé avec succès!");
  console.log("\n📊 Résumé:");
  console.log(`- 1 Admin: admin@statai.com`);
  console.log(`- 1 Établissement: etablissement@lycee-example.com`);
  console.log(`- 6 Étudiants (3 par classe)`);
  console.log(`- 2 Classes: ${classe1.nom}, ${classe2.nom}`);
  console.log(`- 2 Années: ${annee2021_2022.libelle}, ${annee2022_2023.libelle}`);
  console.log(`- 12 Matières (6 par classe)`);
  console.log(`- 8 Périodes (4 par classe)`);
  console.log(`- Notes et appréciations générées`);
  console.log(`\n🔑 Mot de passe pour tous les comptes: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });