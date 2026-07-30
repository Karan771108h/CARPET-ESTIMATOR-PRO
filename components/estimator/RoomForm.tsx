'use client';

import React, { useState } from 'react';
import { Rectangle, Room, UnitSystem } from '../../lib/types/estimation';
import { Plus, Trash2, Home, DoorClosed, Info } from 'lucide-react';

interface RoomFormProps {
  room: Room;
  onChange: (updatedRoom: Room) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ room, onChange }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  const handleUnitToggle = (unit: UnitSystem) => {
    const defaultDoorwayWidth = unit === 'imperial' ? 3 : 0.9;
    onChange({
      ...room,
      unit,
      doorwayWidth: room.doorwayWidth || defaultDoorwayWidth,
    });
  };

  const handleRectangleChange = (
    id: string,
    field: keyof Rectangle,
    value: string | number
  ) => {
    const updatedRectangles = room.rectangles.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          [field]: typeof value === 'number' ? Math.max(0, value) : value,
        };
      }
      return r;
    });
    onChange({ ...room, rectangles: updatedRectangles });
  };

  const addRoomSection = () => {
    const nextNum = room.rectangles.length + 1;
    const newRect: Rectangle = {
      id: `section_${Date.now()}`,
      name: `Section ${nextNum}`,
      length: 10,
      width: 10,
    };
    onChange({ ...room, rectangles: [...room.rectangles, newRect] });
  };

  const removeRoomSection = (id: string) => {
    if (room.rectangles.length <= 1) return;
    const updated = room.rectangles.filter((r) => r.id !== id);
    onChange({ ...room, rectangles: updated });
  };

  const unitLabel = room.unit === 'imperial' ? 'ft' : 'm';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">1. Room Details</h2>
        </div>

        {/* Unit Selector Toggle */}
        <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => handleUnitToggle('imperial')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              room.unit === 'imperial'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            US (Imperial ft)
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('metric')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              room.unit === 'metric'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            UK (Metric m)
          </button>
        </div>
      </div>

      {/* Room Name & Info */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
          Room Name / Label
          <button
            type="button"
            onClick={() => toggleTooltip('roomName')}
            className="text-slate-400 hover:text-blue-600 focus:outline-none"
            title="Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </label>

        {activeTooltip === 'roomName' && (
          <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            Identify the room for proposal client reports (e.g. Master Bedroom, Living Room).
          </div>
        )}

        <input
          type="text"
          value={room.name}
          onChange={(e) => onChange({ ...room, name: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
          placeholder="Main Room"
        />
      </div>

      {/* Room Sections List */}
      <div className="space-y-4">
        {room.rectangles.map((rect, index) => (
          <div
            key={rect.id}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={rect.name || `Section ${index + 1}`}
                  onChange={(e) =>
                    handleRectangleChange(rect.id, 'name', e.target.value)
                  }
                  className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  placeholder="Section Name"
                />
                <button
                  type="button"
                  onClick={() => toggleTooltip(`section_${rect.id}`)}
                  className="text-slate-400 hover:text-blue-600 focus:outline-none"
                  title="Info"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {room.rectangles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoomSection(rect.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                  title="Remove Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {activeTooltip === `section_${rect.id}` && (
              <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                Add separate length and width for each rectangular section to approximate L-shapes or complex room layouts.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  Length ({unitLabel})
                  <button
                    type="button"
                    onClick={() => toggleTooltip(`len_${rect.id}`)}
                    className="text-slate-400 hover:text-blue-600 focus:outline-none"
                    title="Info"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </label>

                {activeTooltip === `len_${rect.id}` && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
                    The longer parallel wall length of this section.
                  </div>
                )}

                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={rect.length || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleRectangleChange(
                      rect.id,
                      'length',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. 20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  Width ({unitLabel})
                  <button
                    type="button"
                    onClick={() => toggleTooltip(`wid_${rect.id}`)}
                    className="text-slate-400 hover:text-blue-600 focus:outline-none"
                    title="Info"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </label>

                {activeTooltip === `wid_${rect.id}` && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
                    The perpendicular wall width of this section.
                  </div>
                )}

                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={rect.width || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleRectangleChange(
                      rect.id,
                      'width',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. 15"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRoomSection}
        className="mt-3 w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-blue-500 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50/50 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Room Section
      </button>

      {/* Doorways & Openings */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
            Doorways Count
            <button
              type="button"
              onClick={() => toggleTooltip('doorwaysCount')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>

          {activeTooltip === 'doorwaysCount' && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
              Number of door openings. Doorway widths subtract from perimeter tackless rod requirements.
            </div>
          )}

          <input
            type="number"
            min="0"
            value={room.doorwaysCount || 0}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              onChange({
                ...room,
                doorwaysCount: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            Doorway Width ({unitLabel})
            <button
              type="button"
              onClick={() => toggleTooltip('doorwayWidth')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>

          {activeTooltip === 'doorwayWidth' && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
              Standard door opening width (typically 3 ft or 0.9 m).
            </div>
          )}

          <input
            type="number"
            step="0.1"
            min="0"
            value={room.doorwayWidth || (room.unit === 'imperial' ? 3 : 0.9)}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              onChange({
                ...room,
                doorwayWidth: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
