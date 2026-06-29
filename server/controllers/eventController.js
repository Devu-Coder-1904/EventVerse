const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.search) filters.title = { $regex: req.query.search, $options: 'i' };

        const events = await Event.find(filters).populate('createdBy', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    console.log("🔥 CREATE EVENT CONTROLLER RUNNING 🔥");
    console.log('createEvent req.user:', req.user);


    try {

        console.log("Req Body", req.body);

        const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body;

        // IMPORTANT: React ke form inputs strings aate hain.
        // totalSeats/ticketPrice parse na hone par Mongoose required fields fail ho sakti hain.
        const parsedTotalSeats = Number(totalSeats);
        const parsedTicketPrice = Number(ticketPrice ?? 0);

        console.log('Parsed totalSeats:', parsedTotalSeats, 'ticketPrice:', parsedTicketPrice);


        if (!Number.isFinite(parsedTotalSeats) || parsedTotalSeats <= 0) {
            return res.status(400).json({ message: 'totalSeats must be a number greater than 0' });
        }
        if (!Number.isFinite(parsedTicketPrice) || parsedTicketPrice < 0) {
            return res.status(400).json({ message: 'ticketPrice must be a number greater than or equal to 0' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats: parsedTotalSeats,
            // HARD OVERRIDE (kabhi bhi missing/undefined na ho)
            availableSeats: parsedTotalSeats,
            ticketPrice: parsedTicketPrice,
            imageUrl: imageUrl ?? '',
            createdBy: req.user.id
        });


        console.log('Created event availableSeats:', event.availableSeats, 'totalSeats:', event.totalSeats);

        res.status(201).json(event);

    } catch (error) {
        console.log('createEvent ERROR:', error);
        console.log('createEvent req.body raw:', req.body);

        console.log(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

