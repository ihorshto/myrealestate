<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridWeek,dayGridDay' // user can switch between the two
                },
                dateClick: this.handleDateClick,
                events: [
                    { title: 'event 1', date: '2023-07-08', currentHour: '22:13:11' },
                    { title: 'event 1', date: '2023-07-07', currentHour: '22:13:11' },
                ],
                eventClick: this.handleDeleteClick,

            }
        }
    },
    methods: {
        handleDateClick: function (arg) {
            let message = prompt();
            let date = new Date();
            let currentDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            if (message.length != 0) {
                let obj = { title: message, date: arg.dateStr, currentHour: currentDate };
                this.calendarOptions.events.push(obj);
                obj = {}
                console.log(obj);
            } else {
                return 0;
            }
        },
        handleDeleteClick: function (arg) {
            console.log(arg.event);
            arg.event.remove()

        }
    }
}

</script>
<template>
    <div class="container">
        <FullCalendar :options="calendarOptions">
            <template v-slot:eventContent='arg'>
                <b>{{ arg.event.title }}</b><br>
                <b>{{ arg.event.extendedProps.currentHour }}</b><br>

            </template>
        </FullCalendar>
    </div>
</template>