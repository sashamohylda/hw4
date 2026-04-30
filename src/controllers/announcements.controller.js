import createHttpError from 'http-errors';
import prisma from '../../prisma/client.js';

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   title: { type: string }
 *                   description: { type: string }
 *                   price: { type: number }
 *                   userId: { type: integer }
 *                   createdAt: { type: string, format: date-time }
 *                   updatedAt: { type: string, format: date-time }
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        user: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement data
 *       404:
 *         description: Not found
 */
export const getAnnouncementById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, name: true } },
      },
    });
    if (!announcement) throw createHttpError(404, 'Announcement not found');
    return res.status(200).json(announcement);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create announcement (requires auth)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Created — includes userId field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 title: { type: string }
 *                 description: { type: string }
 *                 price: { type: number }
 *                 userId: { type: integer }
 *       401:
 *         description: Unauthorized
 */
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        price: Number(price),
        userId: req.user.id,  // встановлюється authenticate middleware
      },
      include: {
        user: { select: { id: true, username: true, name: true } },
      },
    });

    // Відповідь містить userId як скалярне поле + user як relation
    return res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Update announcement (only owner)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
export const updateAnnouncement = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) throw createHttpError(404, 'Announcement not found');

    // Ownership check
    if (announcement.userId !== req.user.id) {
      throw createHttpError(403, 'Access denied');
    }

    // ✅ ВАЖЛИВО: деструктуруємо тільки дозволені поля — НЕ req.body напряму,
    // щоб не допустити зміни userId або інших службових полів
    const { title, description, price } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);

    const updated = await prisma.announcement.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, username: true, name: true } },
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Delete announcement (only owner)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) throw createHttpError(404, 'Announcement not found');

    // Ownership check
    if (announcement.userId !== req.user.id) {
      throw createHttpError(403, 'Access denied');
    }

    await prisma.announcement.delete({ where: { id } });
    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};
