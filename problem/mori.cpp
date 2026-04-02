#include <bits/stdc++.h>

#define pb push_back
#define mp make_pair
#define ff first
#define ss second

using namespace std;

bool vis[105][105];
int moveb[] = {-1, 1};
int moveh[] = {-1, 1};
int main(){
    int i, j;
    int n, m, x1, y1, x2, y2, b, h;
    cin >> n >> m >> b >> h >> x1 >> y1 >> x2 >> y2;
    queue<pair<int, pair<int,int> > > Q;
    Q.push(mp(0, mp(x1, y1)));
    vis[x1][y1] = 1;
    while(!Q.empty())
    {
        int x, y, val;
        x = Q.front().ss.ff;
        y = Q.front().ss.ss;
        val = Q.front().ff;
        Q.pop();
        if(x == x2 && y == y2)
        {
            cout << val << '\n';
            return 0;
        }
        for(i = 0; i < 2; i++)
            for(j = 0; j < 2; j++){
                int xx = x + b * moveb[i];
                int yy = y + h * moveh[j];
                if(xx >= 1 && xx <= n && yy >= 1 && yy <= m && !vis[xx][yy])
                {
                    vis[xx][yy] = 1;
                    Q.push(mp(val + 1, mp(xx, yy)));
                }
            }
        for(i = 0; i < 2; i++)
            for(j = 0; j < 2; j++){
                int xx = x + h * moveh[i];
                int yy = y + b * moveb[j];
                if(xx >= 1 && xx <= n && yy >= 1 && yy <= m && !vis[xx][yy])
                {
                    vis[xx][yy] = 1;
                    Q.push(mp(val + 1, mp(xx, yy)));
                }
            }
    }
    cout << "-1";
    return 0;
}
