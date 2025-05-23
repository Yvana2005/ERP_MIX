import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const TaskBtn = ({ path }) => {
	return (
		<div>
			<Tooltip title='Statut de la tâche'>
				<Link to={path}>
					<button className='bg-amber hover:bg-amber-700 text-white font-bold  px-2 rounded mr-2'>
						<i class='bi bi-sticky-fill'></i>
					</button>
				</Link>
			</Tooltip>
		</div>
	);
};

export default TaskBtn;
