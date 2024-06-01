class Customer {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;

    }

    get info() {
        return `${this.name} (${this.email})`;
    }
}


class Reservation {
    constructor(id, customer, date, guests) {
        this.id = id;
        this.customer = customer;
        this.date = date;
        this.guests = guests;
    }
    get info(){
        return `${this.customer.info} - ${this.guests} personas - ${this.date.toLocaleString()}`
    }
    
    static validateReservation(reservationData) {
        const { date, guests } = reservationData;
        const today = new Date();
        const reservationDate = new Date(date);

        if (reservationDate < today) {
            return false;
        }
        if (guests <= 0) {
            return false;
        }
        return true;
        
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);


if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}

// prueba de validacion retorna false 
// al agregar numero negativo o 0 y la fecha anterior a la actual
const invalid = Reservation.validateReservation({
    date: "2023-01-01T19:30:00",
    guests: 0
});
console.log(invalid);
