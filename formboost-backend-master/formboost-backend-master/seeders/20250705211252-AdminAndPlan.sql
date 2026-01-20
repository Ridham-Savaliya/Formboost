-- Insert Admin
INSERT INTO `Admins` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'Dharm Vachhani',
  'dharm@Formboom.site',
  '$2b$10$T0HtuNr9bUMM8wBzGzOnre4ww91qhe7JFQsNrNQO253i.FoX2B1tu',
  NOW(),
  NOW()
);

-- Insert Plans
INSERT INTO `Plans` (`id`, `name`, `formLimit`, `submissionLimit`, `price`, `isFree`, `createdAt`, `updatedAt`)
VALUES
  (
    UUID(),
    'Free',
    5,
    100,
    0.00,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'Pro',
    50,
    10000,
    49.99,
    FALSE,
    NOW(),
    NOW()
  ),
  (
    UUID(),
    'Enterprise',
    200,
    100000,
    199.99,
    FALSE,
    NOW(),
    NOW()
  );
