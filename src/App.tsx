import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usePointTracker } from "./feature/usePointTracker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
import { Button } from "./components/ui/button";

function App() {
  const {
    point,
    winStreak,
    pointHistory,
    canUndo,
    recordResult,
    undo,
    reset,
    applyStartPoint,
  } = usePointTracker();

  const [startPointInput, setStartPointInput] = useState("0");

  const handleApplyStartPoint = () => {
    const parsed = parseInt(startPointInput, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, parsed);
    applyStartPoint(clamped);
    setStartPointInput(String(clamped));
  };

  const handleReset = () => {
    if (window.confirm("記録をリセットしますか？")) {
      reset();
    }
  };

  const isStartPointInputValid = () => {
    const parsed = parseInt(startPointInput, 10);
    return !Number.isNaN(parsed);
  };

  const chartData = pointHistory.map((p, i) => ({ match: i, point: p }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            ポイントトラッカー
          </CardTitle>
          <CardDescription>Pokemon TCGP 対戦成績</CardDescription>
        </CardHeader>

        <CardContent>
          {/* スタートポイント設定 */}
          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              スタートポイント
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={startPointInput}
              onChange={(e) => setStartPointInput(e.target.value)}
              className="w-24 rounded-md border border-input bg-background px-3 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              size="sm"
              className="cursor-pointer rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500"
              disabled={!isStartPointInputValid()}
              onClick={handleApplyStartPoint}
            >
              適用
            </Button>
          </div>

          {/* ステータス表示 */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                現在ポイント
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{point}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                連勝数
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums">
                {winStreak}
              </p>
            </div>
          </div>

          {/* グラフ */}
          <div className="mb-6 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 85%)" />
                <XAxis
                  dataKey="match"
                  label={{
                    value: "Match",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: "Point",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(0 0% 90%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="point"
                  stroke="hsl(250 60% 60%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(250 60% 60%)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Win / Lose / Draw ボタン */}
          <div className="mb-3 flex gap-3">
            <Button
              size="lg"
              className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-5 text-base font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95"
              onClick={() => recordResult("win")}
            >
              Win
            </Button>
            <Button
              size="lg"
              className="flex-1 cursor-pointer rounded-xl bg-rose-600 py-5 text-base font-semibold text-white transition-all hover:bg-rose-500 active:scale-95"
              onClick={() => recordResult("lose")}
            >
              Lose
            </Button>
            <Button
              size="lg"
              className="flex-1 cursor-pointer rounded-xl bg-slate-500 py-5 text-base font-semibold text-white transition-all hover:bg-slate-400 active:scale-95"
              onClick={() => recordResult("draw")}
            >
              Draw
            </Button>
          </div>

          {/* Undo / リセット ボタン */}
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 cursor-pointer rounded-lg text-sm font-medium"
              disabled={!canUndo}
              onClick={undo}
            >
              Undo
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 cursor-pointer rounded-lg text-sm font-medium text-rose-600 hover:text-rose-500"
              onClick={handleReset}
            >
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
