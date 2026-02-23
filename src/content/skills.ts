export type SkillCategory = {
  label: string;
  main?: string[];
  secondary?: string[];
  familiar?: string[];
  other?: string[];
  databases?: string[];
  orms?: string[];
};

export const skills: SkillCategory[] = [
  {
    label: "good_practices",
    main: ["Hexagonal Architecture", "DDD", "SOLID", "Testing"],
  },
  {
    label: "backend",
    main: ["Node.js", "NestJS", "Express", "Fastify"],
    secondary: ["Fiber", "Spring Boot"],
  },
  {
    label: "infra & tools",
    main: ["Docker", "Kubernetes", "Git", "CI/CD"],
    secondary: ["AWS"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    orms: ["TypeORM", "Sequelize", "Mongoose"],
  },
  {
    label: "languages",
    main: ["TypeScript"],
    secondary: ["Go", "Java"],
    familiar: ["Python"],
  },
  {
    label: "frontend",
    main: ["React", "Angular", "Next.js"],
    secondary: ["Vue"],
    other: ["Ionic"],
  },
];
