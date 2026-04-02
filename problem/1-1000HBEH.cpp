#include <bits/stdc++.h>

using namespace std;

int i , j , m , l , n , p , nm , k;
int a[1000] , b[1000] , c[1000] , d[1000];
long long sum = 1;
bool f[1001];

void seive(){
    f[2] = 0;
    for(i = 4 ; i <= 1000 ; i += 2) f[i] = 1;
    for(i = 3 ; i <= 1000 ; i += 2){
        if(f[i] == 0){
            for(j = i * i ; j <= 1000 ; j += i) f[j] = 1;
        }
    }
}

int main(){
    cin >> n;
    seive();
    nm = 1;
    a[1] = 1;
    for(i = 2; i <= n ; i++){
        m = 1;
        if(f[i] == 0){
            
            memset(c , 0 , sizeof(c));
            
            while(m <= n){
                m *= i;
            }
            
            m /= i;
            l = 1;
            
            while(m > 0){
                d[l] = m % 10;
                m /= 10;
                l++;
            }
            
            l--;
            
            for(j = 1 ; j <= l ; j++){
                b[j] = d[l + 1 - j];
            }
            
            for(j = 1 ; j <= nm ; j++)
                for(k = 1 ; k <= l ; k++) c[j + k] += a[j] * b[k];
            
            nm += l;
            p = 0;
            
            for(j = nm ; j >= 2 ; j--){
                c[j] += p;
                p = c[j] / 10;
                c[j] %= 10;
            }
            
            if(p != 0) {
                c[1] = p;
                for(j = 1 ; j <= nm ; j++){
                    a[j] = c[j];
                }
            }
            
            else{
                for(j = 2 ; j <= nm ; j++){
                    a[j - 1] = c[j];
                }
                nm--;
            }
        }
    }
    for(i = 1 ; i <= nm ; i ++) cout << a[i];
}
