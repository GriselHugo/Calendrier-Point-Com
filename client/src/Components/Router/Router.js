import { Routes, Route } from 'react-router-dom';

import Home from '../Home/Home';
import Calendar from '../Calendar/Calendar';
import Todo from '../Todo/Todo';

function Router() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/todo" element={<Todo />} />
            </Routes>
        </div>
    );
}

export default Router;
